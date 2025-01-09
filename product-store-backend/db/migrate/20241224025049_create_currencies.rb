class CreateCurrencies < ActiveRecord::Migration[8.0]
  def change
    create_table :currencies do |t|
      t.string :symbol, null: false
      t.decimal :rate, precision: 10, scale: 2, null: false

      t.timestamps
    end
  end
end
