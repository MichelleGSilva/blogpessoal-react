import { useState, useContext, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../../../contexts/AuthContext"
import type Tema from "../../../models/Tema"
import { buscar, deletar } from "../../../services/Service"
import { ClipLoader } from "react-spinners";
import { ToastAlerta } from "../../../utils/ToastAlerta"

function DeletarTema() {

    const navigate = useNavigate()

    const [tema, setTema] = useState<Tema>({} as Tema) // tema no singular pq só deleta um tema por vez

    const [isLoading, setIsLoading] = useState<boolean>(false)
    
    const { usuario, handleLogout } = useContext(AuthContext)
    const token = usuario.token

    const { id } = useParams<{ id: string }>() //pega o id da url atráves do hook useParams

    async function buscarPorId(id: string) { //busca o tema pelo id
        try {
            await buscar(`/temas/${id}`, setTema, { // service buscar encontre as infos do tema a ser excluido
                headers: {
                    'Authorization': token
                }
            })
        } catch (error: any) { // se houver erro o catch pega - geralmente só de autorização 401
            if (error.toString().includes('401')) {
                handleLogout()
            }
        }
    }

    useEffect(() => {
        if (token === '') {
            ToastAlerta('Você precisa estar logado', 'info')
            navigate('/')
        }
    }, [token])

    useEffect(() => {
        if (id !== undefined) { // se o id existir, chama a função buscarPorId
            buscarPorId(id)
        }
    }, [id])

    async function deletarTema() {
        setIsLoading(true) // inicia o estado de carregamento

        try { // tenta deletar o tema
            await deletar(`/temas/${id}`, { // service deletar para excluir o tema
                headers: { // passa o token no cabeçalho da requisição
                    'Authorization': token
                }
            })

             ToastAlerta('Tema deletado com sucesso', 'sucesso')

        } catch (error: any) { // erro 401 token inválido ou expirado / erros genericos
            if (error.toString().includes('401')) {
                handleLogout()
            }else {
                 ToastAlerta('Erro ao deletar o tema.', 'erro')
            }
        }

        setIsLoading(false) // finaliza o estado de carregamento
        retornar() // retorna para a lista de temas
    }

    function retornar() {
        navigate("/temas")
    }
    
    return (
        <div className='container w-1/3 mx-auto'>
            <h1 className='text-4xl text-center my-4'>Deletar tema</h1>
            <p className='text-center font-semibold mb-4'>
                Você tem certeza de que deseja apagar o tema a seguir?</p>
            <div className='border flex flex-col rounded-2xl overflow-hidden justify-between'>
                <header 
                    className='py-2 px-6 bg-orange-600 text-white font-bold text-2xl'>
                    Tema
                </header>
                <p className='p-8 text-3xl bg-emerald-100 h-full'>{tema.descricao}</p>
                <div className="flex">
                    <button 
                        className='text-slate-100 bg-emerald-500 hover:bg-emerald-700 w-full py-2'
                        onClick={retornar}>
                        Não
                    </button>
                    <button 
                        className='w-full text-slate-100 bg-amber-500 
                                   hover:bg-amber-700 flex items-center justify-center'
                                   onClick={deletarTema}>

                        { isLoading ? 
                            <ClipLoader 
                                color="#ffffff" 
                                size={24}
                            /> : 
                            <span>Sim</span>
                        }

                    </button>
                </div>
            </div>
        </div>
    )
}
export default DeletarTema