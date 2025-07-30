import { Query } from "mongoose";

export const excludeField = ["searchTerm", "sort", "fields", "page", "limit"];

export class QueryBuilder<T> {
    public modelQuery: Query<T[], T>;
    public readonly query: Record<string, string>;

    constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
        this.modelQuery = modelQuery;
        this.query = query;
    }

    filter(exactFields: string[] = []): this {
        const rawFilter = { ...this.query };

        for (const field of excludeField) {
            delete rawFilter[field];
        }

        const filterQuery: Record<string, any> = {};

        for (const key in rawFilter) {
            const value = rawFilter[key];

            if (key === "from" || key === "to") {
                if (!filterQuery.createdAt) {
                    filterQuery.createdAt = {};
                }

                if (key === "from") {
                    filterQuery.createdAt.$gte = new Date(value);
                }

                if (key === "to") {
                    const toDate = new Date(value);
                    toDate.setDate(toDate.getDate() + 1);
                    filterQuery.createdAt.$lte = toDate;
                }
            } else if (value === "true" || value === "false") {
                filterQuery[key] = value === "true";
            } else if (!isNaN(Number(value))) {
                filterQuery[key] = Number(value);
            } else if (exactFields.includes(key)) {
                filterQuery[key] = value;
            } else {
                filterQuery[key] = { $regex: value, $options: "i" };
            }
        }

        this.modelQuery = this.modelQuery.find(filterQuery);
        return this;
    }

    search(searchableFields: string[]): this {
        const searchTerm = this.query.searchTerm || "";
        if (searchTerm && searchableFields.length > 0) {
            const searchQuery = {
                $or: searchableFields.map((field) => ({
                    [field]: { $regex: searchTerm, $options: "i" },
                })),
            };
            this.modelQuery = this.modelQuery.find(searchQuery);
        }
        return this;
    }

    sort(): this {
        const sort = this.query.sort || "-createdAt";
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }

    fields(): this {
        const fields = this.query.fields?.split(",").join(" ") || "";
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }

    paginate(): this {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = (page - 1) * limit;

        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }

    build() {
        return this.modelQuery;
    }

    async getMeta() {
        const totalDocuments = await this.modelQuery.model.countDocuments();

        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;

        const totalPage = Math.ceil(totalDocuments / limit);

        return { page, limit, total: totalDocuments, totalPage };
    }
}
