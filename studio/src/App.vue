<style>
body {
  background-color: lightgrey;
}

.editor-row {
  padding: 10px;
  border-left: 1px solid black;
  border-right: 1px solid black;
  border-bottom: 1px solid black;
}

.editor-row:last-child {
  border-bottom: 0 solid black;
}

.results
{
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}

.expand-button {
  height: 1.5em;
  margin: 10px;
}

.sticky-search-panel {
  border-bottom: 1px solid black;
  background-color: lightgrey;
  padding: 10px;
}
</style>
<template>
  <div>
    <div class="container-fluid">
      <div>

        <Search
            @export-search="exportSearchResultsToMarkdown"
            @search-parameters-cleared="searchParametersCleared"
            @search-parameters-changed="searchParametersChanged"
            :query="search.query"
            :start="search.start"
            :stop="search.stop"
            :errors="search.errors"
        />

        <div class="results">
          <div v-for="bookmark in bookmarks" class="editor-row" :key="bookmark.bookmarkId">
            <Editor
                @save-bookmark="saveBookmark"
                @open-bookmark="openBookmark"
                @delete-bookmark="deleteBookmark"
                :bookmark="bookmark"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Search from './components/bookmarks/Search.vue'
import Editor from './components/bookmarks/Editor.vue'
import SearchQuery from './SearchQuery.js'
import BookmarkService from './BookmarkService.js'

// todo make this configuration
const appServiceRoot = '/' //  getEnv('VUE_APP_SERVICE_ROOT')
const rootUrl = ((u) => (u.endsWith('/') ? u : u + '/'))(appServiceRoot) + 'api/'
const bookmarkService = new BookmarkService(rootUrl)

export default {
  created() {
  },
  components: {
    Editor,
    Search,
  },
  mounted() {
    console.log('--------------------------------------------------')
    console.log('connecting to ' + bookmarkService.bookmarkUri)
    console.log('--------------------------------------------------')
    this.searchParametersChanged(this.search)
  },
  methods: {
    exportSearchResultsToMarkdown(search) {
      this.search = search
      bookmarkService.exportResults(this.search)
    },
    toggleSearch() {
      this.showSearch = !this.showSearch
    },

    searchParametersCleared() {
      this.loadBookmarks([])
    },
    async searchParametersChanged(search) {
      this.search = search
      console.log('the search has changed', JSON.stringify(this.search))
      const results = await bookmarkService.search(this.search)
      this.loadBookmarks(results)
    },
    openBookmark(bookmark) {
      window.open(bookmark.href, 'twi_window')
    },
    async deleteBookmark(bookmark) {
      await bookmarkService.delete(bookmark.bookmarkId)
      await this.searchParametersChanged(this.search)
    },
    async saveBookmark(bookmark) {
      await bookmarkService.save(bookmark)
      await this.searchParametersChanged(this.search)
    },

    loadBookmarks: function (bookmarks) {
      bookmarks = Array.from(bookmarks).map((bookmark) => {
        bookmark.time = bookmark.time * 1000
        return bookmark
      })
      bookmarks.sort((a, b) => {
        const aHasEdited = a.edited === null
        const bHasEdited = b.edited === null
        if (aHasEdited) {
          return -1
        }
        if (bHasEdited) {
          return 1
        }
        return 0
      })

      this.$nextTick(() => {
        this.bookmarks = bookmarks
        this.count = this.bookmarks.length
      })
    }
  },
  data() {
    function oneWeekAgo(now) {
      const minute = 1000 * 60
      const hour = minute * 60
      const day = 24 * hour
      const week = day * 7
      return new Date(now - week)
    }

    const today = new Date()
    return {
      count: 0,
      showSearch: true,
      account: {
        authenticated: false
      },
      search: new SearchQuery(null, false, oneWeekAgo(today), today),
      debug: false,
      bookmarks: []
    }
  }
}
</script>
