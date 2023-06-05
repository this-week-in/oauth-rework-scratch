<style scoped>
.search-panel {
  padding-bottom: 1em;
  padding-top: 1em;
}
</style>
<template>
  <div class="search-panel">
    <form>
      <div class="form-group">
        <label for="searchQuery">Query</label>
        <input
          type="text"
          v-model="search.query"
          class="form-control"
          id="searchQuery"
          placeholder="Query"
        />
      </div>
      <div class="form-group">
        <label for="startDate">Start Date </label>
        <DatePick class="form-control" id="startDate" v-model="search.start" />
      </div>
      <div class="form-group">
        <label for="startDate">Stop Date </label>
        <DatePick class="form-control" id="stopDate" v-model="search.stop" />
      </div>
      <div class="form-check">
        <input class="form-check-input" v-model="search.errors" type="checkbox" id="searchErrors" />
        <label class="form-check-label" for="searchErrors"> Show only those needing review </label>
      </div>
      <div class="mt-2">
        <button title="Search" class="mr-1" @click.prevent="onSearchChange">search</button>
        <button title="Clear" class="mr-1" @click.prevent="clearSearch">clear</button>
        <button title="Export to Markdown File" class="mr-1" @click.prevent="exportToMarkdown">
          export
        </button>
      </div>
    </form>
  </div>
</template>
<script>
import SearchQuery from '../../SearchQuery'
import DatePick from '../util/DatePick.vue'

export default {
  components: { DatePick },
  name: 'Search',
  props: ['query', 'stop', 'start', 'errors'],
  watch: {
    /*
        whenever the property called 'value' is changed
        externally, we want to refresh our view of that property
       */
    query: function (/* newValue*/) {},
    errors: function (/* newValue*/) {},
    start: function (/* newValue*/) {},
    stop: function (/* newValue*/) {}
  },
  methods: {
    exportToMarkdown() {
      window.emitter.emit('export-search', this.search)
    },
    onSearchChange() {
      window.emitter.emit('search-parameters-changed', this.search)
    },
    clearSearch() {
      this.search = new SearchQuery(this.query, this.errors, this.start, this.stop)
      window.emitter.emit('search-parameters-cleared', this.search)
    }
  },
  data() {
    return {
      startDate: null,
      search: new SearchQuery(this.query, this.errors, this.start, this.stop)
    }
  }
}
</script>
