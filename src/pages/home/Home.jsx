import React, { useEffect, useState } from "react";
import "./home.scss";
import Swal from "sweetalert2";

const Home = () => {
  const columnas = Array.from({ length: 10 }, (_, i) => (i + 1).toString());
  const filas = Array.from({ length: 10 }, (_, i) =>
    String.fromCharCode(65 + i)
  );
  const [posicionBarco, setPosicionBarco] = useState([]);
  const [comando, setComando] = useState();
  const [ataques, setAtaques] = useState([]);
  const [cantidadAtaques, setCantidadAtaques] = useState(0);

  if(cantidadAtaques == 5){
    Swal.fire("Excelente!", "Has destruido todos los barcos", "success")
    .then(() => {
      window.location.reload();
    });
  }

  useEffect(() => {
    posicionesAleatoria();
  }, []);

  const onChangeInput = (e) => {
    setComando(e.target.value);
  };

  const posicionesAleatoria = () => {
    const barcosAleatorios = [];
    for (let i = 0; i < 5; i++) {
      const fila = String.fromCharCode(65 + Math.floor(Math.random() * 10));
      const columna = (Math.floor(Math.random() * 10) + 1).toString();
      const posicion = `${fila}${columna}`;

      if (!barcosAleatorios.includes(posicion)) {
        barcosAleatorios.push(posicion);
      } else {
        i--;
      }
    }
    setPosicionBarco(barcosAleatorios);
    console.log(barcosAleatorios)
  };

  const validarPosicionBarco = () => {
    if (comando?.length > 0 && cantidadAtaques < 5) {
      const posicion = comando.toUpperCase();
      const validar = posicionBarco.filter((item) => item == posicion);
      if (!ataques.some((item) => item.position === posicion)) {
        if (validar.length > 0) {
          setAtaques([...ataques, { position: posicion, isStroke: "O" }]);
          setCantidadAtaques(cantidadAtaques + 1)
        } else {
          setAtaques([...ataques, { position: posicion, isStroke: "X" }]);
        }
      } else {
        Swal.fire("Oops", "Ya realizo el ataque en esta posición", "error");
      }
    } else {
      Swal.fire("Oops", "Debe ingresar una posición", "error");
    }
    setComando("");
  };

  const realizarAtaque = (position) => {
    const posicionActual = position.join("");
    const ataqueEnPosicion = ataques.find(item => item.position === posicionActual);
    if (ataqueEnPosicion) {
      return ataqueEnPosicion.isStroke;
    } else {
      return ""; 
    }
  };

  const reiniciarPartida = () => {
    window.location.reload()
  }

  return (
    <div className="home_batalla">
      <span>barcos destruidos: {cantidadAtaques}</span>
      <span>Comandos:</span>
      <div className="home_batalla_comandos">
        <input
          className="home_batalla_comandos_input"
          type="text"
          onChange={(e) => onChangeInput(e)}
          placeholder="<fila><columna>"
        />
        <button
          className="home_batalla_comandos_button-ejecutar"
          onClick={validarPosicionBarco}
        >
          Ejecutar
        </button>
        <button className="home_batalla_comandos_button-limpiar" onClick={reiniciarPartida}>
          Limpiar
        </button>
      </div>

      <div className="home_batalla_matriz">
        <table>
          <thead>
            <tr>
              <th></th>
              {columnas.map((columna, index) => (
                <th key={index}>{columna}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.map((fila, filaIndex) => (
              <tr key={filaIndex}>
                <th>{fila}</th>
                {columnas.map((columna, columnaIndex) => (
                  <td key={columnaIndex}>{realizarAtaque([fila, columna])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
