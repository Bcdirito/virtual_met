class ArtworkSerializer < ActiveModel::Serializer
  attributes :id, :api_id, :image_url, :department_id
  has_one :department
end
