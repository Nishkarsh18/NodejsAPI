class APIFilters {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  filter() {
    const querycopy = { ...this.queryStr };

    //removing sort from the query
    const removefields = ["sort", "fields", "q", "limit", "page"];
    removefields.forEach((field) => {
      delete querycopy[field];
    });
    this.query = this.query.find(querycopy);
    return this;
  }
  sort() {
    //only including sort
    if (this.queryStr.sort) {
      const sortby = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortby);
    } else {
      this.query = this.query.sort("-postingDate");
    }
    return this;
  }
  limitfields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }
  searchbyquery() {
    if (this.queryStr.q) {
      const qu = this.queryStr.q.split("-").join(" ");
      this.query = this.query.find({ $text: { $search: '"' + qu + '"' } });
    }
    return this;
  }
  pagination() {
    const page = parseInt(this.queryStr.page, 10) || 1;
    const limit = parseInt(this.queryStr.limit, 10) || 10;
    const skipresults = (page - 1) * limit;
    this.query = this.query.skip(skipresults).limit(limit);
    return this;
  }
}
module.exports = APIFilters;
