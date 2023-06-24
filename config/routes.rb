Rails.application.routes.draw do
  get 'homepage/index'
  root 'homepage#index'
  namespace :api do
namespace :v1 do
resources :friends, only: [:index]
end
end
end




