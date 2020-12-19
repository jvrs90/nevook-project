import gql from 'graphql-tag';

//#region Public

export const book_public_find = gql`
    query book_public_find {
        book_public_find {
            _id
            title
            slug
            author {
                _id
                name
                slug
                photo
            }
            genre {
                _id
                name
                slug
                photo
            }
            synopsis
            cover
        }
    }
`;

export const book_public_find_by_slug = gql`
    query book_public_find_by_slug($bookSlug: String!) {
        book_public_find_by_slug(bookSlug: $bookSlug) {
            _id
            title
            slug
            author {
                _id
                name
                slug
                photo
            }
            genre {
                _id
                name
                slug
                photo
            }
            synopsis
            cover
        }
    }
`;

export const book_public_find_by_slug_array = gql`
    query book_public_find_by_slug_array($booksSlugs: [String!]!) {
        book_public_find_by_slug_array(booksSlugs: $booksSlugs) {
            _id
            title
            slug
            author {
                _id
                name
                slug
                photo
            }
            genre {
                _id
                name
                slug
                photo
            }
            synopsis
            cover
        }
    }
`;

//#endregion

//#region Find

export const book_admin_find = gql`
    query book_admin_find($paginate: PaginateDto) {
        book_admin_find(paginate: $paginate) {
            data {
                _id
                title
                slug
                synopsis
                cover
                author {
                    _id
                    name
                    slug
                    photo
                }
                genre {
                    _id
                    name
                    slug
                    photo
                }
                createdBy {
                    _id
                    usertitle
                    title
                    email
                }
            }
            offset
            limit
            total
        }
    }
`;


export const book_admin_find_by_id = gql`
    query book_admin_find_by_id($bookId: ID!) {
        book_admin_find_by_id(bookId: $bookId) {
            _id
                title
                slug
                synopsis
                author {
                    _id
                    name
                    slug
                    photo
                }
                genre {
                    _id
                    name
                    slug
                    photo
                }
                cover
                createdBy {
                    _id
                    usertitle
                    title
                    email
                }
        }
    }
`;

export const book_admin_find_by_id_array = gql`
	query book_admin_find_by_id_array($bookIds: [ID!]) {
		book_admin_find_by_id_array(bookIds: $bookIds) {
			_id
			title
            slug
			cover
		}
	}
`;

//#endregion

//#region Author

export const book_admin_create = gql`
    mutation book_admin_create($bookData: AuthorCreateDto!) {
        book_admin_create(bookData: $bookData )
    }
`;

export const book_admin_modify = gql`
	mutation book_admin_modify($bookId: ID!, $input: AuthorModifyDto!) {
		book_admin_modify(bookId: $bookId, input: $input)
	}
`;

export const book_admin_delete = gql`
	mutation book_admin_delete($bookId: ID!) {
		book_admin_delete(bookId: $bookId)
	}
`;

//#endregion