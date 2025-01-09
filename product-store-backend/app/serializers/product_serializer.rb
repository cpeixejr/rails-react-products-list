class ProductSerializer < ActiveModel::Serializer
  attributes :id, :name, :price_usd, :price_brl, :price_eur, :price_gbp, :price_jpy, :expiration_date

  def price_usd
    object.price
  end

  def price_brl
    convert_price('brl')
  end

  def price_eur
    convert_price('eur')
  end

  def price_gbp
    convert_price('gbp')
  end

  def price_jpy
    convert_price('jpy')
  end

  private

  def convert_price(currency_symbol)
    currency = Currency.find_by(symbol: currency_symbol)
    return nil unless currency

    (object.price * currency.rate).round(2)
  end
end