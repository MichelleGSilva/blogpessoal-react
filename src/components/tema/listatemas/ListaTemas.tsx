import { useNavigate } from "react-router-dom";
import CardTema from "../cardtema/CardTema"
import { SyncLoader } from "react-spinners";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import type Tema from "../../../models/Tema";
import { buscar } from "../../../services/Service";

function ListaTemas() {

const navigate = useNavigate(); // hook de navegação -> "teletransporte de telas"

    const [isLoading, setIsLoading] = useState<boolean>(false) // estado de carregamento

    const [temas, setTemas] = useState<Tema[]>([]) // estado para armazenar a lista de temas (começa como array vazio)

    const { usuario, handleLogout } = useContext(AuthContext) // obtém o token de autenticação do contexto de autenticação
    const token = usuario.token

    useEffect(() => { // verifica se o usuário está autenticado
        if (token === '') { // se não houver token (usuário não autenticado)
            alert('Você precisa estar logado!')
            navigate('/')
        }
    }, [token])

    useEffect(() => { // efeito colateral para buscar os temas quando o componente é montado ou quando a lista de temas muda
        buscarTemas()    
    }, [temas.length])

    async function buscarTemas() { // busca os temas
        try {

            setIsLoading(true) // inicia o estado de carregamento

            await buscar('/temas', setTemas, { // faz a requisição para buscar os temas
                headers: { Authorization: token } // inclui o token no cabeçalho da requisição
            })
        } catch (error: any) { // captura erros
            if (error.toString().includes('401')) { // se o erro for 401 (não autorizado)
                handleLogout() // desloga o usuário
            }
        }finally { // finaliza o estado de carregamento
            setIsLoading(false) 
        }
    }

    return (
        <>

         {isLoading && (
    <SyncLoader
        color="#312e81"
    	size={32}
	/>
)}
            <div className="flex justify-center w-full my-4">
                <div className="container flex flex-col">

                    {(!isLoading && temas.length === 0) && ( // se não estiver carregando e a lista de temas estiver vazia, exibe a mensagem
	<span className="text-3xl text-center my-8">
		Nenhum Tema foi encontrado!
	</span>
)}
                    <div className="grid grid-cols-1 md:grid-cols-2 
                                    lg:grid-cols-3 gap-8">
{
    temas.map((tema) => ( // mapeia a lista de temas e renderiza um CardTema para cada tema
    	<CardTema key={tema.id} tema={tema}/> // passa o tema como prop para o CardTema
    ))
}
                    </div>
                </div>
            </div>
        </>
    )
}
export default ListaTemas;