import gql from 'graphql-tag';

//#region Public

export const author_public_find = gql`
    query author_public_find {
        author_public_find {
            _id
            name
            slug
            bio
            photo
        }
    }
`;

export const author_public_find_by_slug = gql`
    query author_public_find_by_slug($authorSlug: String!) {
        author_public_find_by_slug(authorSlug: $authorSlug) {
            _id
            name
            slug
            bio
            photo
        }
    }
`;

export const author_public_find_by_slug_array = gql`
    query author_public_find_by_slug_array($authorsSlugs: [String!]!) {
        author_public_find_by_slug_array(authorsSlugs: $authorsSlugs) {
            _id
            name
            slug
            bio
            photo
        }
    }
`;

//#endregion

//#region Find

export const author_admin_find = gql`
    query author_admin_find($paginate: PaginateDto) {
        author_admin_find(paginate: $paginate) {
            data {
                _id
                name
                slug
                bio
                photo
                createdBy {
                    _id
                    username
                    name
                    email
                }
            }
            offset
            limit
            total
        }
    }
`;


export const author_admin_find_by_id = gql`
    query author_admin_find_by_id($authorId: ID!) {
        author_admin_find_by_id(authorId: $authorId) {
            _id
                name
                slug
                bio
                photo
                createdBy {
                    _id
                    username
                    name
                    email
                }
        }
    }
`;

export const author_admin_find_by_id_array = gql`
	query author_admin_find_by_id_array($authorIds: [ID!]) {
		author_admin_find_by_id_array(authorIds: $authorIds) {
			_id
			title
			image
		}
	}
`;

//#endregion

//#region Author

export const author_admin_create = gql`
    mutation author_admin_create($authorData: AuthorCreateDto!) {
        author_admin_create(authorData: $authorData )
    }
`;

export const author_admin_modify = gql`
	mutation author_admin_modify($authorId: ID!, $input: AuthorModifyDto!) {
		author_admin_modify(authorId: $authorId, input: $input)
	}
`;

export const author_admin_delete = gql`
	mutation author_admin_delete($authorId: ID!) {
		author_admin_delete(authorId: $authorId)
	}
`;

//#endregion