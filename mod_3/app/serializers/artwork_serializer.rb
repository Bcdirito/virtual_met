class ArtworkSerializer < ActiveModel::Serializer
  attributes :id, :title, :primary_image, :name, :display_bio, :ishighlight
  has_one :department
end
