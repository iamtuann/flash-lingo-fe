import { computed } from "vue";
import { useRoute } from "vue-router";


export function useSearch() {
  const route = useRoute()
  const query = computed(() => {
    return route.query.query || ""
  })
  const routeName = computed(() => {
    return route.name
  })

  return {
    query,
    routeName
  }
}