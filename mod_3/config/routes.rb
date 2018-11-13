Rails.application.routes.draw do
  get "/index", to: "application#index"
  resources :departments, only: [:index, :show]
  resources :artworks, only: [:index, :show]
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
