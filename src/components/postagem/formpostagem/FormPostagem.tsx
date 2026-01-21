import { useContext, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { AuthContext } from "../../../contexts/AuthContext";
import type Postagem from "../../../models/Postagem";
import type Tema from "../../../models/Tema";
import { atualizar, buscar, cadastrar } from "../../../services/Service";

function FormPostagem() {

const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [temas, setTemas] = useState<Tema[]>([]) //Cria um estado para armazenar uma lista de temas, tipada como Tema[], iniciando vazia.

    const [tema, setTema] = useState<Tema>({ id: 0, descricao: '', }) // Cria um estado para armazenar um único tema, tipado como Tema, com valores iniciais padrão
    
    const [postagem, setPostagem] = useState<Postagem>({} as Postagem)

    const { usuario, handleLogout } = useContext(AuthContext)
    const token = usuario.token

    const { id } = useParams<{ id: string }>()

    async function buscarPostagemPorId(id: string) { // Declara uma função assíncrona que recebe o id da postagem
        try { // Inicia o bloco para tratamento de erros
            await buscar(`/postagens/${id}`, setPostagem, { // Faz a requisição para a API, buscando a postagem pelo ID -- setPostagem é a função que atualiza o estado postagem
                headers: { Authorization: token } // Envia o token de autenticação no header da requisição
            }) // Envia o token de autenticação no header da requisição
        } catch (error: any) { // Captura qualquer erro ocorrido na requisição
            if (error.toString().includes('401')) { // Verifica se o erro é de não autorizado (401)
                handleLogout() // Executa o logout do usuário
            }
        }
    }

    async function buscarTemaPorId(id: string) {
        try {
            await buscar(`/temas/${id}`, setTema, {
                headers: { Authorization: token }
            })
        } catch (error: any) {
            if (error.toString().includes('401')) {
                handleLogout()
            }
        }
    }

    async function buscarTemas() {
        try {
            await buscar('/temas', setTemas, {
                headers: { Authorization: token }
            })
        } catch (error: any) {
            if (error.toString().includes('401')) {
                handleLogout()
            }
        }
    }

    useEffect(() => {
        if (token === '') {
            alert('Você precisa estar logado');
            navigate('/');
        }
    }, [token])

    useEffect(() => { // Hook que executa efeitos colaterais
        buscarTemas() // Chama a função para buscar os temas quando o componente é montado

        if (id !== undefined) { // Verifica se o id da postagem está definido (indica edição)
            buscarPostagemPorId(id) // Chama a função para buscar a postagem pelo ID
        }
    }, [id]) // Executa o efeito sempre que o id mudar

    useEffect(() => {
        setPostagem({ // Atualiza o estado postagem sempre que o estado tema mudar
            ...postagem, // espalha os atributos atuais da postagem
            tema: tema, // Atualiza o campo tema da postagem com o estado tema atual
        })
    }, [tema])

    function atualizarEstado(e: ChangeEvent<HTMLInputElement>) { // Função para atualizar o estado da postagem com base na entrada do usuário
        setPostagem({
            ...postagem,
            [e.target.name]: e.target.value, // Atualiza o campo correspondente com o valor do input (como no Swagger)
            tema: tema,
            usuario: usuario,
        });
    }

    function retornar() {
        navigate('/postagens');
    }

    async function gerarNovaPostagem(e: FormEvent<HTMLFormElement>) { 
        e.preventDefault() // Evita o comportamento padrão do formulário (recarregar a página)
        setIsLoading(true) // Define o estado de carregamento como verdadeiro

        if (id !== undefined) { // Verifica se o id existe 
            try {
                await atualizar(`/postagens`, postagem, setPostagem, {
                    headers: {
                        Authorization: token,
                    },
                });

                alert('Postagem atualizada com sucesso')

            } catch (error: any) {
                if (error.toString().includes('401')) { 
                    handleLogout()
                } else {
                    alert('Erro ao atualizar a Postagem')
                }
            }

        } else {
            try {
                await cadastrar(`/postagens`, postagem, setPostagem, { // se o id não existir, cria uma nova postagem
                    headers: {
                        Authorization: token,
                    },
                })

                alert('Postagem cadastrada com sucesso');

            } catch (error: any) {
                if (error.toString().includes('401')) {
                    handleLogout()
                } else {
                    alert('Erro ao cadastrar a Postagem');
                }
            }
        }

        setIsLoading(false)
        retornar()
    }

    const carregandoTema = tema.descricao === ''; // Verifica se o tema foi selecionado (descrição vazia indica que não foi selecionado)

    return (
        <div className="container flex flex-col mx-auto items-center">
            <h1 className="text-4xl text-center my-8 text-orange-700">
                     {id !== undefined ? 'Editar Postagem' : 'Cadastrar Postagem'}
            </h1>

            <form className="flex flex-col w-1/2 gap-4"
             onSubmit={gerarNovaPostagem}> 
                <div className="flex flex-col gap-2">
                    <label htmlFor="titulo">Título da Postagem</label>
                    <input
                        type="text"
                        placeholder="Titulo"
                        name="titulo"
                        required
                        className="border-2 border-slate-700 rounded p-2"
                        value={postagem.titulo}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="titulo">Texto da Postagem</label>
                    <input
                        type="text"
                        placeholder="Texto"
                        name="texto"
                        required
                        className="border-2 border-slate-700 rounded p-2"
                        value={postagem.texto}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <p>Tema da Postagem</p>
                    <select name="tema" id="tema" className='border p-2 border-slate-800 rounded' 
                        onChange={(e) => buscarTemaPorId(e.currentTarget.value)}>
                        <option value="" selected disabled>Selecione um Tema</option>
                        
                        {temas.map((tema) => (
                            <>
                                <option value={tema.id} >{tema.descricao}</option>
                            </>
                        ))}
                    </select>
                </div>
                <button 
                    type='submit' 
                    className='rounded disabled:bg-slate-200 bg-emerald-500 hover:bg-emerald-700
                               text-white font-bold w-1/2 mx-auto py-2 flex justify-center'
                   disabled={carregandoTema}> // Desabilita o botão se o tema não estiver carregado
                    { isLoading ? 
                            <ClipLoader 
                                color="#ffffff" 
                                size={24}
                            /> : 
                           <span>{id === undefined ? 'Cadastrar' : 'Atualizar'}</span>
                    }
                </button>
            </form>
        </div>
    );
}

export default FormPostagem;