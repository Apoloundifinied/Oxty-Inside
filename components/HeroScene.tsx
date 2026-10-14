import { Tilt } from "./Tilt";

// Cena 3D do hero (referencia docs/re-design v2): pilha de diarios oficiais com
// destaque do nome, linha de scan e cartao de alerta. CSS puro + Tilt com mola CSS.
export function HeroScene() {
  return (
    <div className="cena" aria-hidden="true">
      <Tilt className="absolute inset-0" max={14}>
        <div className="flut">
          <div className="palco">
            <div className="folha f3" />
            <div className="folha f2" />
            <div className="folha f1">
              <div className="mast">Diário Oficial de Ipiaú (BA)</div>
              <div className="sk" />
              <p>
                …RESOLVE <b>convocar</b> o candidato aprovado no Concurso Público…{" "}
                <mark>MARIVALDO B. DA SILVA</mark> … para comparecer no prazo de 30 (trinta)
                dias…
              </p>
              <div className="sk" style={{ marginTop: 14 }} />
              <div className="scan" />
            </div>
            <div className="alerta-pop">
              <i className="dot" />
              <b className="block text-base">Seu nome apareceu no diário de Ipiaú (BA)</b>
              <small>Alerta enviado agora por e-mail</small>
            </div>
          </div>
        </div>
      </Tilt>
    </div>
  );
}
