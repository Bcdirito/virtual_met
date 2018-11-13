class DepartmentsController < ApplicationController
    def index
        @department = Department.all
        render json: @department
    end
end
