class ExchangeApiService
  include HTTParty
  base_uri "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies"

  def self.fetch_data(endpoint)
    get(endpoint)
  end

  def self.create_currencies
    response = fetch_data('/usd.json')
    return false unless response.success?

    currencies_data = response.parsed_response['usd']
    currencies_data.each do |symbol, rate|
      if ["brl", "eur", "gbp", "jpy"].include? symbol
        Currency.find_or_create_by!(
          symbol: symbol,
          rate: rate
        )
      end
    end

    true
  end
end