import React, { useEffect, useState } from "react";
import "./home.scss";
import Swal from "sweetalert2";

const Home = () => {
  const cantColumnas = 10;
  const cantFilas = 10;
  const columnas = Array.from({ length: cantColumnas }, (_, i) =>
    (i + 1).toString()
  );
  const filas = Array.from({ length: cantFilas }, (_, i) =>
    String.fromCharCode(65 + i)
  );
  const cantidadBarcos = 5;
  const cantESpacionBarco = 4;
  const [posicionBarco, setPosicionBarco] = useState([]);
  const [comando, setComando] = useState();
  const [ataques, setAtaques] = useState([]);
  const [cantidadAtaques, setCantidadAtaques] = useState(0);
  let contador = 0;
  let cont = 0;

  if (cantidadAtaques == cantidadBarcos) {
    Swal.fire("Excelente!", "Has destruido todos los barcos", "success").then(
      () => {
        window.location.reload();
      }
    );
  }

  useEffect(() => {
    posicionesAleatoria();
  }, []);

  useEffect(() => {
    console.log("cambio");
    if (cont >= 1) {
      if (contador < cantidadBarcos) {
        contador++;
        posicionesAleatoria();
      } else {
        contador = 0;
        return;
      }
    }else{
      cont ++;
    }
  }, [posicionBarco]);

  const onChangeInput = (e) => {
    setComando(e.target.value);
  };

  /**
   * función que valida si las posiciones del barco se pueden utilizar, segun la orientacion
   * @param {*} orientacion 1 es vertical y 2 horizontal
   */
  const validarOrientacion = (orientacion, numFila, numColumna) => {
    let arrayPosiciones = [];
    if (Number(orientacion) == 1) {
      for (
        let i = numFila;
        i < (numFila + cantESpacionBarco > 9 ? 9 : numFila + cantESpacionBarco);
        i++
      ) {
        const fila = String.fromCharCode(65 + (i + 1));
        if (posicionBarco.length > 0) {
          posicionBarco?.map((item) => {
            const validar = item.filter(
              (element) => element == `${fila}${numColumna + 1}`
            );
            if (validar.length > 0) {
              posicionesAleatoria();
            } else {
              arrayPosiciones.push(`${fila}${numColumna + 1}`);
            }
          });
        } else {
          arrayPosiciones.push(`${fila}${numColumna + 1}`);
        }
      }
    } else {
      for (
        let i = numColumna;
        i <
        (numColumna + cantESpacionBarco >= 10
          ? 10
          : numColumna + cantESpacionBarco);
        i++
      ) {
        const fila = String.fromCharCode(65 + numFila + 1);
        if (posicionBarco.length > 0) {
          posicionBarco?.map((item) => {
            const validar = item.filter(
              (element) => element == `${fila}${i + 1}`
            );
            if (validar.length > 0) {
              posicionesAleatoria();
            } else {
              arrayPosiciones.push(`${fila}${i + 1}`);
            }
          });
        } else {
          arrayPosiciones.push(`${fila}${i + 1}`);
        }
      }
    }
    if (arrayPosiciones.length == cantESpacionBarco) {
      const arrayTemp = [...posicionBarco, arrayPosiciones];
      console.log(arrayTemp);
      setPosicionBarco(arrayTemp);
    } else {
      if (contador < cantidadBarcos) {
        posicionesAleatoria();
      }
    }
  };

  const posicionesAleatoria = () => {
    const numFila = Math.floor(Math.random() * cantFilas);
    const numColumna = Math.floor(Math.random() * cantColumnas);
    const orientacion = (Math.floor(Math.random() * 2) + 1).toString();
    validarOrientacion(orientacion, numFila - 1, numColumna);
  };

  const validarPosicionBarco = () => {
    console.log(posicionBarco);
    // if (comando?.length > 0 && cantidadAtaques < cantidadBarcos) {
    //   const posicion = comando.toUpperCase();
    //   const validar = posicionBarco.filter((item) => item == posicion);
    //   if (!ataques.some((item) => item.position === posicion)) {
    //     if (validar.length > 0) {
    //       setAtaques([...ataques, { position: posicion, isStroke: "O" }]);
    //       setCantidadAtaques(cantidadAtaques + 1);
    //     } else {
    //       setAtaques([...ataques, { position: posicion, isStroke: "X" }]);
    //     }
    //   } else {
    //     Swal.fire("Oops", "Ya realizo el ataque en esta posición", "error");
    //   }
    // } else {
    //   Swal.fire("Oops", "Debe ingresar una posición", "error");
    // }
  };

  const pintarAtaque = (position, filaIndex, columnaIndex) => {
    const posicionActual = position.join("");
    const ataqueEnPosicion = ataques.find(
      (item) => item.position === posicionActual
    );
    if (ataqueEnPosicion) {
      return ataqueEnPosicion.isStroke;
    } else {
      return "";
    }
  };

  const reiniciarPartida = () => {
    window.location.reload();
  };

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
        <button
          className="home_batalla_comandos_button-limpiar"
          onClick={reiniciarPartida}
        >
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
                  <td key={columnaIndex}>
                    {pintarAtaque([fila, columna], filaIndex, columnaIndex)}
                  </td>
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
