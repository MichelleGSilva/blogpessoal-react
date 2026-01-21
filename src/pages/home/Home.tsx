import ListaPostagens from "../../components/postagem/listapostagens/ListaPostagens"
import ModalPostagem from "../../components/postagem/modalpostagem/ModalPostagem"

function Home() {
    return (
        <>
            <div className="bg-orange-500 flex justify-center">
                <div className='container grid grid-cols-2 text-white'>
                    <div className="flex flex-col gap-4 items-center justify-center py-4">
                        <h2 className='text-5xl font-bold text-center'>
                            Seja Bem Vindo (a) ao <br/>
                            100Neura Tech 🤍
                        </h2>
                        <p className='text-xl text-center'>
                            Um espaço feito com carinho para compartilhar ideias, <br/>
                            aprendizados e inspirações sobre tecnologia.
                        </p>

                        <div className="flex justify-around gap-4">
                         <ModalPostagem />
                            </div>
                        </div>

                    <div className="flex justify-center ">
                        <img
                            src="https://ik.imagekit.io/k8aunjtbla/100NeuraTech_arquivo_2.png"
                            alt="Imagem Página Home"
                            className='w-2/3'
                        />
                    </div>
                </div>
            </div>
             <ListaPostagens />
        </>
    )
}

export default Home
