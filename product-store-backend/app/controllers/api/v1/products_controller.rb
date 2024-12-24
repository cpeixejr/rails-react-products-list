class Api::V1::ProductsController < ApplicationController
  def index
    products = ProductsService.list_products(filter_params)

    render json: products,
           each_serializer: ProductSerializer,
           status: :ok
  rescue StandardError => e
    render json: { message: e.message }, status: :unprocessable_entity
  end

  private

  def filter_params
    params.permit(
      :search,
      :sort,
      :min_price,
      :max_price,
      :min_expiration,
      :max_expiration,
      :sort_by,
      :sort_direction
    ).to_h
  end
end