
class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        // 1A) Filtering
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        //1B) Advance filtering
        let queryStr = JSON.stringify(queryObj);
        // console.log(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('_id');
        }
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ').replace(/password/g, '');
            this.query = this.query.select(fields); //whatever fields are there in the query will only be selected , rest not
        } else {
            this.query = this.query.select('-__v');   // This __v will never be selected(excluded)

        }
        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;  //default value 1
        const limit = this.queryString.limit * 1 || 100;  //default value 100
        const skip = (page - 1) * limit;
        // page=3&limit=10, 1-10 page 1, 11-20 page 2, 21-30 page 3 and so on
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = APIFeatures;