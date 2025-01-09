class Api::V1::UploadController < ApplicationController
  def upload_products
    if ExchangeApiService.create_currencies
      ProductsService.create_products_from_csv(params[:file])
      render json: { message: "Products were uploaded and currencies updated" }, status: :ok
    else
      render json: { message: "The exchange-api service is down" }, status: :service_unavailable
    end
  rescue StandardError => e
    render json: { message: e.message }, status: :unprocessable_entity
  end
end
