require 'csv'
require 'date'

class ProductsService
  def self.create_products_from_csv(file)
    return unless file

    begin
      CSV.foreach(file.path, col_sep: ";", headers: true) do |row|
        next unless valid_row?(row)

        Product.create!(
          name: sanitize_name(row["name"]),
          price: sanitize_price(row["price"]),
          expiration_date: sanitize_date(row["expiration"])
        )
      end
    rescue CSV::MalformedCSVError => e
      Rails.logger.error("CSV Parse Error: #{e.message}")
      raise StandardError, "Invalid CSV file: #{e.message}"
    end
  end

  def self.list_products(filters = {})
    products = Product.all

    if filters[:search].present?
      products = products.where('name ILIKE ?', "%#{filters[:search]}%")
    end

    if filters[:sort].present?
      direction = 'asc'
      sort_field = filters[:sort]

      if sort_field.start_with?('-')
        direction = 'desc'
        sort_field = sort_field[1..-1]
      end

      case sort_field
      when 'name'
        products = products.order(name: direction)
      when 'price'
        products = products.order(price: direction)
      when 'expiration_date'
        products = products.order(expiration_date: direction)
      end
    end

    products = apply_filters(products, filters)
    products
  end

  private

  def self.valid_row?(row)
    row['name'].present? &&
    row['price'].present? &&
    row['expiration'].present? &&
    sanitize_date(row['expiration']).present?
  end

  def self.apply_filters(products, filters)
    products = products.where('price >= ?', filters[:min_price]) if filters[:min_price].present?
    products = products.where('price <= ?', filters[:max_price]) if filters[:max_price].present?

    if filters[:min_expiration].present?
      products = products.where('expiration_date >= ?', filters[:min_expiration])
    end

    if filters[:max_expiration].present?
      products = products.where('expiration_date <= ?', filters[:max_expiration])
    end

    products
  end

  def self.sanitize_csv_content(file)
    content = File.read(file.path)
    # Remove BOM if present
    content = content.force_encoding('UTF-8').gsub("\xEF\xBB\xBF", '')
    content.gsub(/\r\n?/, "\n")
  end

  def self.sanitize_price(price)
    return 0 if price.nil?

    sanitized = price.gsub(/[$£€\s]/, '')
    sanitized = sanitized.tr(',', '.')

    begin
      (sanitized.to_f).round(2)
    rescue StandardError => e
      Rails.logger.error("Price conversion error: #{e.message} for price: #{price}")
      0
    end
  end

  def self.sanitize_name(name)
    return '' if name.nil?
    name.strip.gsub(/[^0-9a-zA-Z\s]/, '')
  end

  def self.sanitize_date(date_string)
    return nil if date_string.nil? || date_string.empty?

    begin
      if date_string.match?(%r{\d{1,2}/\d{1,2}/\d{4}})
        month, day, year = date_string.split('/')
        Date.new(year.to_i, month.to_i, day.to_i)
      elsif date_string.match?(%r{\d{1,2}-\d{1,2}-\d{4}})
        month, day, year = date_string.split('-')
        Date.new(year.to_i, month.to_i, day.to_i)
      else
        Date.parse(date_string)
      end
    rescue ArgumentError, Date::Error => e
      Rails.logger.error("Date conversion error: #{e.message} for date: #{date_string}")
      nil
    end
  end
end
