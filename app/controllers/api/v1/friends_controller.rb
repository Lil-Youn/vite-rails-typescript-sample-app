class Api::V1::FriendsController < ApplicationController
def index
@friends = Friend.all
render json: @friends
end
end
