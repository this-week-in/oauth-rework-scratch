export default class BookmarkService {
    constructor(bookmarkUri) {
        this.bookmarkUri = bookmarkUri // be mindful were using a proxy so everything should be suffixed with '/api
        console.log('the bookmark API is', this.bookmarkUri)
    }

    async me() {
        const result = await fetch(this.bookmarkUri + 'me')
        return ( await result.json()).name
    }

    buildSearchResultsUrl(path, searchQuery) {
        const params = {}
        if (searchQuery.query !== null && searchQuery.query.trim() !== '') {
            params['query'] = searchQuery.query
        }

        if (searchQuery.errors !== null) {
            params['errors'] = searchQuery.errors
        }

        if (searchQuery.start !== null) {
            params['start'] = searchQuery.start.getTime()
        }

        if (searchQuery.stop !== null) {
            params['stop'] = searchQuery.stop.getTime()
        }

        const queryParams = []
        for (let k in params) {
            queryParams.push(k + '=' + params[k])
        }
        const url = this.bookmarkUri + `bookmarks/${path}?${queryParams.join('&')}`
        console.log('url', url)
        return url
    }

    exportResults(searchQuery) {
        console.log('opening export results.')
        const searchResultsUrl = this.buildSearchResultsUrl('export', searchQuery)
        window.open(searchResultsUrl)
    }

    async search(searchQuery) {
        const context = {
            method: 'GET',
            headers: {
                Accept: 'application/json'
            }
        }
        const searchResultsUrl = this.buildSearchResultsUrl('search', searchQuery)
        const result = await fetch(searchResultsUrl, context)
        return await result.json()
    }

    async delete(id) {
        const context = {
            method: 'DELETE',
            headers: {
                Accept: 'application/json'
            }
        }
        return await fetch(this.bookmarkUri + 'bookmarks/' + id, context)
    }

    async save(bookmark) {
        const encodedBookmarkId = bookmark.bookmarkId

        const json = {
            command: 'update',
            href: bookmark.href,
            description: bookmark.description.trim(),
            tags: bookmark.tags.join(',')
        }

        const context = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(json)
        }
        return await fetch(this.bookmarkUri + 'bookmarks/' + encodedBookmarkId, context)
    }
}
