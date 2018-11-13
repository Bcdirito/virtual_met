class CreateArtworks < ActiveRecord::Migration[5.2]
  def change
    create_table :artworks do |t|
      t.integer :api_id
      t.string :image_url
      t.belongs_to :department, foreign_key: true

      t.timestamps
    end
  end
end
