let frm_login, frm_registro, home;
let btn_ir_a_registro, btn_enviar_registrar,btn_enviar;
let correo;
let img_perfil = "https://icons.iconarchive.com/icons/goodstuff-no-nonsense/free-space/72/space-ship-1-icon.png";

window.onload = function(){
  frm_login = document.getElementById("frm_login");
  btn_enviar = document.getElementById("btn_enviar");
  btn_enviar_registrar = document.getElementById("btn_enviar_registrar");
  frm_registro = document.getElementById("frm_registro");
  home = document.getElementById("home");
  btn_ir_a_registro = document.getElementById("btn_ir_a_registro");
  btn_ir_a_registro.addEventListener("click",irARegistro);
  //btn_enviar.addEventListener("click",validar);
  btn_enviar_registrar.addEventListener("click",registrar);
  configurar_login();
}

function configurar_login(){
  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      compararClave();
      form.classList.add('was-validated')
    }, false)
  });
}

function irARegistro(event){
  frm_login.reset();
  cambiarFormulario();
}

function cambiarFormulario()
{
  frm_login.classList.toggle("ocultar");
  frm_registro.classList.toggle("ocultar");
}

function guardar(event){
  let correo = document.getElementById("correo");
  let clave = document.getElementById("clave");
  event.preventDefault();
  localStorage.setItem("correo",correo.value);
  localStorage.setItem("clave",clave.value);
}

function compararClave(){
  
  let correo = document.getElementById("correo");
  let clave = document.getElementById("clave");
  event.preventDefault();
  let usuario = JSON.parse(localStorage.getItem("usuario"));
  let html;
  if(correo.value==usuario.correo && clave.value== usuario.clave)
  {
    frm_login.classList.add("ocultar");
    home.classList.remove("ocultar");
    html = `
      <nav>
        <img src="${img_perfil}" />
        <a href="javascript:void(0);" id="btn_cerrar_sesion" onclick="cerrarSesion();">Cerrar sesion</a>
      </nav>
      <h2>Pagina principal </h2> 
      <br>Hola ${usuario.nombre}
     `;
    home.innerHTML = html;
  }
  else{
    alert("Datos incorrectos");
  }
}

function cerrarSesion(event){
  frm_login.classList.remove("ocultar");
  home.classList.add("ocultar");
}

function registrar(event){
 
  let nombre = document.getElementById("nombre");
  let apellido = document.getElementById("apellido");
  let celular = document.getElementById("celular");
  let direccion = document.getElementById("direccion");
  let correo = document.getElementById("correo1");
  let clave = document.getElementById("clave1");
  let usuario = {
    nombre:nombre.value,
    apellido:apellido.value,
    celular:celular.value,
    direccion:direccion.value,
    correo:correo.value,
    clave:clave.value
  };
  event.preventDefault();
  
  localStorage.setItem("usuario",JSON.stringify(usuario));
  alert("¡Muy bien, registro exitoso!")
  cambiarFormulario();
}
"use strict";

class SortableTable {
  constructor(tableNode) {
    this.tableNode = tableNode;

    this.columnHeaders = tableNode.querySelectorAll("thead th");

    this.sortColumns = [];

    for (var i = 0; i < this.columnHeaders.length; i++) {
      var ch = this.columnHeaders[i];
      var buttonNode = ch.querySelector("button");
      if (buttonNode) {
        this.sortColumns.push(i);
        buttonNode.setAttribute("data-column-index", i);
        buttonNode.addEventListener("click", this.handleClick.bind(this));
      }
    }

    this.optionCheckbox = document.querySelector(
      'input[type="checkbox"][value="show-unsorted-icon"]'
    );

    if (this.optionCheckbox) {
      this.optionCheckbox.addEventListener(
        "change",
        this.handleOptionChange.bind(this)
      );
      if (this.optionCheckbox.checked) {
        this.tableNode.classList.add("show-unsorted-icon");
      }
    }
  }

  setColumnHeaderSort(columnIndex) {
    if (typeof columnIndex === "string") {
      columnIndex = parseInt(columnIndex);
    }

    for (var i = 0; i < this.columnHeaders.length; i++) {
      var ch = this.columnHeaders[i];
      var buttonNode = ch.querySelector("button");
      if (i === columnIndex) {
        var value = ch.getAttribute("aria-sort");
        if (value === "descending") {
          ch.setAttribute("aria-sort", "ascending");
          this.sortColumn(
            columnIndex,
            "ascending",
            ch.classList.contains("num")
          );
        } else {
          ch.setAttribute("aria-sort", "descending");
          this.sortColumn(
            columnIndex,
            "descending",
            ch.classList.contains("num")
          );
        }
      } else {
        if (ch.hasAttribute("aria-sort") && buttonNode) {
          ch.removeAttribute("aria-sort");
        }
      }
    }
  }

  sortColumn(columnIndex, sortValue, isNumber) {
    function compareValues(a, b) {
      if (sortValue === "ascending") {
        if (a.value === b.value) {
          return 0;
        } else {
          if (isNumber) {
            return a.value - b.value;
          } else {
            return a.value < b.value ? -1 : 1;
          }
        }
      } else {
        if (a.value === b.value) {
          return 0;
        } else {
          if (isNumber) {
            return b.value - a.value;
          } else {
            return a.value > b.value ? -1 : 1;
          }
        }
      }
    }

    if (typeof isNumber !== "boolean") {
      isNumber = false;
    }

    var tbodyNode = this.tableNode.querySelector("tbody");
    var rowNodes = [];
    var dataCells = [];

    var rowNode = tbodyNode.firstElementChild;

    var index = 0;
    while (rowNode) {
      rowNodes.push(rowNode);
      var rowCells = rowNode.querySelectorAll("th, td");
      var dataCell = rowCells[columnIndex];

      var data = {};
      data.index = index;
      data.value = dataCell.textContent.toLowerCase().trim();
      if (isNumber) {
        data.value = parseFloat(data.value);
      }
      dataCells.push(data);
      rowNode = rowNode.nextElementSibling;
      index += 1;
    }

    dataCells.sort(compareValues);

    while (tbodyNode.firstChild) {
      tbodyNode.removeChild(tbodyNode.lastChild);
    }

    for (var i = 0; i < dataCells.length; i += 1) {
      tbodyNode.appendChild(rowNodes[dataCells[i].index]);
    }
  }

  handleClick(event) {
    var tgt = event.currentTarget;
    this.setColumnHeaderSort(tgt.getAttribute("data-column-index"));
  }

  handleOptionChange(event) {
    var tgt = event.currentTarget;

    if (tgt.checked) {
      this.tableNode.classList.add("show-unsorted-icon");
    } else {
      this.tableNode.classList.remove("show-unsorted-icon");
    }
  }
}

window.addEventListener("load", function () {
  var sortableTables = document.querySelectorAll("table.sortable");
  for (var i = 0; i < sortableTables.length; i++) {
    new SortableTable(sortableTables[i]);
  }
});
