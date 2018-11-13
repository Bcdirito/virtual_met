class CreateArtworks < ActiveRecord::Migration[5.2]
  def change
    create_table :artworks do |t|
      t.string :title
      t.string :primary_image
      t.string :name
      t.string :display_bio
      t.boolean :ishighlight
      t.belongs_to :department, foreign_key: true

      t.timestamps
    end
  end
end
