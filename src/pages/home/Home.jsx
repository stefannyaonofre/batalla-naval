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
  const [contador, setContador] = useState(0);

  useEffect(() => {
    posicionesAleatoria();
  }, []);

  useEffect(() => {
    verBarcoDescubierto();
    if (contador < cantidadBarcos) {
      setContador(contador + 1);
      posicionesAleatoria(contador);
    }
  }, [posicionBarco]);

  const onChangeInput = (e) => {
    setComando(e.target.value);
  };

  const validarOrientacion = (orientacion, numFila, numColumna, contador) => {
    let arrayPosiciones = [];
    if (Number(orientacion) === 1) {
      for (
        let i = numFila;
        i < (numFila + cantESpacionBarco > (cantFilas - 1) ? (cantFilas - 1) : numFila + cantESpacionBarco);
        i++
      ) {
        const fila = String.fromCharCode(65 + (i + 1));
        if (posicionBarco.length > 0) {
          let encontro = false;
          posicionBarco?.forEach((item) => {
            const validar = item.filter(
              (element) => element.posicion === `${fila}${numColumna + 1}`
            );
            if (validar.length > 0) {
              encontro = true;
            }
          });

          if (!encontro) {
            const newPosition = {
              posicion: `${fila}${numColumna + 1}`,
              encontrado: false,
            };
            arrayPosiciones.push(newPosition);
          } else {
            if (contador < cantidadBarcos) {
              posicionesAleatoria(contador);
            }
          }
        } else {
          const newPosition = {
            posicion: `${fila}${numColumna + 1}`,
            encontrado: false,
          };
          arrayPosiciones.push(newPosition);
        }
      }
    } else {
      for (
        let i = numColumna;
        i <
        (numColumna + cantESpacionBarco >= cantColumnas
          ? cantColumnas
          : numColumna + cantESpacionBarco);
        i++
      ) {
        const fila = String.fromCharCode(65 + numFila + 1);
        if (posicionBarco.length > 0) {
          let encontro = false;
          posicionBarco?.forEach((item) => {
            const validar = item.filter(
              (element) => element.posicion === `${fila}${i + 1}`
            );
            if (validar.length > 0) {
              encontro = true;
            }
          });

          if (!encontro) {
            const newPosition = {
              posicion: `${fila}${i + 1}`,
              encontrado: false,
            };
            arrayPosiciones.push(newPosition);
          } else {
            if (contador < cantidadBarcos) {
              posicionesAleatoria(contador);
            }
          }
        } else {
          const newPosition = {
            posicion: `${fila}${i + 1}`,
            encontrado: false,
          };
          arrayPosiciones.push(newPosition);
        }
      }
    }
    if (arrayPosiciones.length === cantESpacionBarco) {
      const arrayTemp = [...posicionBarco, arrayPosiciones];
      setPosicionBarco(arrayTemp);
    } else {
      if (contador < cantidadBarcos) {
        posicionesAleatoria(contador);
      }
    }
  };

  const posicionesAleatoria = (contador) => {
    const numFila = Math.floor(Math.random() * cantFilas);
    const numColumna = Math.floor(Math.random() * cantColumnas);
    const orientacion = (Math.floor(Math.random() * 2) + 1).toString();
    validarOrientacion(orientacion, numFila - 1, numColumna, contador);
  };

  const validarPosicionBarco = (posicion) => {
    const pos = posicion == '' ? comando.toUpperCase() : posicion;
    if (pos?.length > 0) {
      const copiaPosicionBarco = [...posicionBarco];
      let descubierto = "";
      copiaPosicionBarco.forEach((item) => {
        const encontroPosicion = item.find(
          (element) => element.posicion == pos
        );
        if (encontroPosicion) {
          encontroPosicion.encontrado = true;
          setPosicionBarco([...copiaPosicionBarco]);
          descubierto = "O";
          setAtaques([...ataques, { posicion: pos, descubierto }]);
          throw new Error("");
        } else {
          descubierto = "X";
          setAtaques([...ataques, { posicion: pos, descubierto }]);
        }
      });
    } else {
      Swal.fire("Oops", "Debe ingresar una posición", "error");
    }
    setComando('');
  };

  const verBarcoDescubierto = () => {
    let contador = 0;
    posicionBarco.map((item) => {
      let cont = 0;
      item.map((element) => {
        if (element.encontrado) {
          cont++;
        }
      });
      if (cont == cantESpacionBarco) {
        contador++;
      }
    });
    setCantidadAtaques(contador);
    if (contador === cantidadBarcos) {
      Swal.fire({title: "Excelente!",html: "Has destruido todos los barcos", icon:"success",confirmButtonText: 'Aceptar'}).then(
        () => {
          window.location.reload();
        }
      );
    }
  };

  const pintarAtaque = (posicion) => {
    const ataqueEnPosicion = ataques.find((item) => item.posicion === posicion);
    if (ataqueEnPosicion) {
      return ataqueEnPosicion.descubierto;
    } else {
      return "";
    }
  };

  const reiniciarPartida = () => {
    window.location.reload();
  };

  return (
    <div className="home_batalla">
      <h1>Batalla Naval</h1>
      <span>Para Jugar puedes ingresar el comando fila columna en el campo de texto, o puedes dar click en el recuadro del tablero que deseas descubrir</span>
      <h4>Barcos destruidos: {cantidadAtaques}</h4>
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
          onClick={() => validarPosicionBarco('')}
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
                  <td 
                  key={columnaIndex} 
                  onClick={() => validarPosicionBarco(`${fila}${columna}`)} 
                  className={`${pintarAtaque(`${fila}${columna}`) == 'X' ? 'batalla_color_fallo' : pintarAtaque(`${fila}${columna}`) == 'O' ? 'batalla_color_ataque' : ''}`}>
                    {pintarAtaque(`${fila}${columna}`)}
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
