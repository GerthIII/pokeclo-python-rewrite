import { EditOutfitPage, NewOutfitPage } from './components/OutfitForm'
import { DashboardPage } from './components/DashboardPage'
import { ItemsPage } from './components/ItemsPage'
import { OutfitDetail } from './components/OutfitDetail'
import { OutfitsPage } from './components/OutfitsPage'
import { setPendingPhoto } from './pendingPhoto'
import { go, useRoute } from './router'

function Page({ route }: { route: string[] }) {
  const [section, id, action] = route

  if (section === 'outfits') {
    if (id === 'new') return <NewOutfitPage />
    if (id && Number.isInteger(Number(id))) {
      return action === 'edit' ? <EditOutfitPage id={Number(id)} /> : <OutfitDetail id={Number(id)} />
    }
    return <OutfitsPage />
  }
  if (section === 'items') return <ItemsPage startAdding={id === 'new'} />
  return <DashboardPage />
}

export default function App() {
  const route = useRoute()
  const section = route[0] === 'outfits' ? 'outfits' : route[0] === 'items' ? 'items' : 'dashboard'

  return (
    <>
      <header className="topbar">
        <a href="#/">Pokeclo</a>
      </header>
      <main className={section === 'dashboard' ? 'body-container' : 'page'}>
        <Page route={route} />
      </main>
      <nav className="navbar">
        <a
          href="#/items"
          className="navbar-item"
          aria-current={section === 'items' ? 'page' : undefined}
        >
          <i className="fa-solid fa-shirt navbar-icon" aria-hidden="true" />
          <span>Closet</span>
        </a>

        <label className="navbar-item navbar-camera" aria-label="Take a photo of a new item">
          <span className="navbar-camera-pill">
            <i className="fa-solid fa-camera navbar-icon" aria-hidden="true" />
          </span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file) return
              setPendingPhoto(file)
              e.target.value = ''
              go('items/new')
            }}
          />
        </label>

        <a
          href="#/outfits"
          className="navbar-item"
          aria-current={section === 'outfits' ? 'page' : undefined}
        >
          <i className="fa-solid fa-star navbar-icon" aria-hidden="true" />
          <span>Outfits</span>
        </a>
      </nav>
    </>
  )
}
