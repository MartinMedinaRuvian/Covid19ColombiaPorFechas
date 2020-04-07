
let pais = 'Colombia';

async function getDatos(estado){
const respuesta = await fetch(`https://api.covid19api.com/dayone/country/${pais}/status/${estado}`);
const datos = await respuesta.json();
return datos;
}

async function getCasosConfirmadosPorFecha(estado) {
  const datos = await getDatos(estado);
  let datos_confirmados = {};
  datos.forEach((dato) => {
    try {
      const cases = (datos_confirmados[dato.Date]) ? datos_confirmados[dato.Date].cases + dato.Cases : dato.Cases
      datos_confirmados[dato.Date] = {
        cases,
        date: `${dato.Date}`,
      }
    } catch(error) {
      console.log(error)
    }
  })
  return await ordenarPorFecha(datos_confirmados);
}


//Se utiliza libreria que facilitara el ordenamiento de los datos
function ordenarPorFecha(datos_confirmados) {
    return import('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.min.js')
    .then(() => {

      const datos_confirmados_ordenados = _.sortBy(Object.values(datos_confirmados), ['date']);
      return datos_confirmados_ordenados;

    })
  }
 

  //*************************************************************************************************** */
  //********************** CONFIGURAR EL GRAFICO O CHART *****************************************

  
renderisarChart();

async function renderisarChart(){
  let grafica = document.querySelector('#grafica');
  let contexto = grafica.getContext('2d');
  totalCasosPorFecha(contexto);    
}

async function totalCasosPorFecha(contexto){

const confirmados = await getCasosConfirmadosPorFecha('confirmed');
const muertes = await getCasosConfirmadosPorFecha('deaths');
const recuperados = await getCasosConfirmadosPorFecha('recovered');

new Chart(contexto, {
    type:'line',
    data:{
    labels: confirmados.map(dato => new Intl.DateTimeFormat('es-CO', { month:'long', day:'numeric'}).format(new Date(dato.date))),
    datasets:[
        {
            label: 'Muertes',
            data: muertes.map(dato => dato.cases),
            borderColor: 'red'
        },
        {
            label: 'Recuperados',
            data: recuperados.map(dato => dato.cases),
            borderColor: 'green'
        },
        {
            label:'Confirmados',
            data: confirmados.map(dato => dato.cases),
            borderColor: 'orange'
        }
    ]
    },
    options:{        
      title:{
      text:'Casos de Covid19 en Colombia por fechas',
      display:true,
      fontSize:25,
      padding:25,
      fontColor: '#42A5F5',
      },                     
        legend:{
        position:'bottom',
        labels:{
            fontSize:15,
            padding:15,
            boxWidth: 15,
            fontFamily: 'system-ui',
            fontColor: 'black',
            fontStyle: 'bold'
        }
       
    },
    layout:{
   padding:{
       right:50
   }
    },
    tooltips:{
    backgroundColor: '#2962FF',
    titleFontSize:20,
    xPadding:20,
    yPadding:20,
    bodyFontSize:15,
    bodySpacing:10,
    mode: 'x'
    },
    elements:{
        line:{
            borderWidth:5,
            fill:false
        },
        point:{
            radius:6,
            borderWidth:4,
            backgroundColor:'white',
            hoverRadius:8,
            hoverBorderWidth:4
        }

    },
    scales:{
        xAxes:[{
            gridLines:{
                display:false
            }
        }]
        }
 

    }
   
})
}


 