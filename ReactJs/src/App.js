import React, { useState, useEffect } from "react";
import "./styles.css";
import api from "./services/api";

function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('/repositories').then(response => {
      setRepositories(response.data);
    });

  }, []);

  const addRepository = async () => {
    const response = await api.post('/repositories', {
      title: `Testando React com Docker ${Date.now()}`,
      url: "https://github.com/theusccruz/primeiros-modulos-GoStack/blob/main/frontend/src/App.js",
      techs: [
        "NodeJs",
        "React",
        "React Native"
      ],
    });

    setRepositories([...repositories, response.data]);
  }

  const removeRepository = async (id) => {
    await api.delete(`/repositories/${id}`);

    setRepositories(repositories.filter(repository => {
      // retorna somente os repositórios com id diferente do que foi removido
      return repository.id !== id;
    }));
  }

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map(repository => {
          return (
            <li key={repository.id}>
              {repository.title}
              <button onClick={() => removeRepository(repository.id)}>
                Remover
              </button>
            </li>
          )
        })}
      </ul>

      <button onClick={addRepository}>Adicionar</button>
    </div>
  );
}

export default App;
