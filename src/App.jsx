import { experimental_use as use, Suspense, useState, useEffect } from "react"
import {GPS} from "./Gps"

// const Names = () => {
//   const ids = use(fetch('/ids.json')
//     .then(res => res.json())
//   )

//   return (
//     <div>{JSON.stringify(ids)}</div>
//   )
// }

const idsFetch = fetch('/ids.json')
  .then(async res => ({
    status: res.status,
    data: res.status === 200 ? await res.json() : null
  }))

const cachedFetches = {}

const catchedFetch = url => {
  if(!cachedFetches[url]){
    cachedFetches[url] = fetch(url).then(async res => ({
      status: res.status,
      data: res.status === 200 ? await res.json(): null
    }))
  }

  return cachedFetches[url]
}

const Detail = ({id}) => {
  const data = use(catchedFetch(`/${id}.json`))

  console.log(`Rendering Detail ${id}`)

  return (
    <div>{JSON.stringify(data)}</div>
  )
} 

const Names = () => {
  const ids = use(idsFetch)

  console.log(`Rendering names ${ids.data}`)

  return (
    <div>
      {ids?.data.map(id => (
        <Detail key={id} id={id} />
      ))}
    </div>
  )
}

function App() {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const init = async () => {
      const ids = await catchedFetch('/ids.json')
      await Promise.all(ids.data.map(id => catchedFetch(`/${id}.json`)))
      setInitialized(true)
    }

    init()
  },[])
  return (
    <div className="App">
      {initialized && (
        <Suspense>
          <Names />
          <GPS />
        </Suspense>
      )}
    </div>
  )
}

export default App
