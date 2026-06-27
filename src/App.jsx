
import './App.css'

function App() {


  return (
    <>
      <h1 className="text-3xl font-bold underline text-blue-600">
        Hello Tailwind!
      </h1>
      <div className="bg-primary text-white p-4">
        <h1 className="text-2xl font-bold">
          Ceci utilise la couleur définie dans @theme
        </h1>
        <button className="border border-white hover:bg-white hover:text-primary">
          Cliquez ici
        </button>

      </div>
    </>
  )
}

export default App
