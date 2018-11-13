class ArtworksController < ApplicationController
    def index
        @artwork = Artwork.all
        render json: @artwork
    end
end
