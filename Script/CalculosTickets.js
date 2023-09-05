document.addEventListener('DOMContentLoaded', function() {
        var form = document.querySelector('form');
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Detener el envío del formulario por defecto

            var variedad = document.getElementById('variedad').value;
            var promedioGavillas = parseFloat(document.getElementById('prom_gavillas').value);
            var cantGavillasPaca = parseFloat(document.getElementById('cant_gavillas_paca').value);
            var muestraGavillasSumatraField = document.getElementById('muestraGavillasSumatraField');
            var gavillaFundaSumatraField = document.getElementById('gavillaFundaSumatraField');
            var pesoFundaField = document.getElementById('pesoFundaField');

            // Verificar si la variedad es "Sumatra tripa"
            if (variedad === "Sumatra tripa") {
                var muestraGavillasSumatra = parseFloat(document.getElementById('muestra_gavillas_sumatra').value);
                var gavillaFundaSumatra = parseFloat(document.getElementById('gavilla_funda_sumatra').value);
                var pesoFundaSumatra = parseFloat(document.getElementById('peso_funda_sumatra').value);

                if (isNaN(muestraGavillasSumatra) || isNaN(gavillaFundaSumatra) || isNaN(pesoFundaSumatra) ||
                    muestraGavillasSumatra <= 0 || gavillaFundaSumatra <= 0 || pesoFundaSumatra <= 0) {
                    // Mostrar un mensaje de error al usuario
                    showModal('Ingrese valores numéricos mayores a 0 en los campos.');

                    // Detener el proceso y no enviar el formulario
                    return;
                }
                form.submit();
                return;
            }

            // Validar los campos si no es "Sumatra tripa"
            if (isNaN(promedioGavillas) || isNaN(cantGavillasPaca) || promedioGavillas <= 0 || cantGavillasPaca <= 0) {
                
                // Llamar a la función showModal con el mensaje de error
                showModal('Ingrese valores numéricos mayores a 0 en los campos.');

                // Detener el proceso y no enviar el formulario
                return;
            }

            // Continuar con el envío del formulario si los valores son válidos
            form.submit();

            fetch('/tickets', {
                method: 'POST',
                body: new FormData(form)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Hubo un problema al enviar la solicitud al servidor.');
                }
                return response.json();
            })
            .then(data => {
                if (data.errorMessage) {
                    // Disparar el evento personalizado con el mensaje de error
                    var serverErrorEvent = new CustomEvent('serverError', { detail: { errorMessage: data.errorMessage } });
                    document.dispatchEvent(serverErrorEvent);
                } else {
                    window.location.href = '/tickets';
                }
            })
            .catch(error => {
                console.error('Error al procesar la solicitud:', error);
            });
        });
        
        function showModal(errorMessage) {
            var errorMessageElement = document.getElementById("errorMessage");
            errorMessageElement.textContent = errorMessage;

            var errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
            errorModal.show();
        }

        // Seleccionar elementos
        var selectClase = document.querySelector('#clase');
        var selectVariedad = document.querySelector('#variedad');
        var inputPromGavillas = document.querySelector('#prom_gavillas');
        var inputGavillasFunda = document.querySelector('#gavillas_funda');
        var inputHojasFundas = document.querySelector('#hojas_fundas');
        var inputDivision = document.querySelector('#cant_gavillas_fundas');
        var inputHojasGavillas = document.querySelector('#hojas_gavillas');
        var inputCantGavillasPaca = document.querySelector('#cant_gavillas_paca');
        var inputPromHojasPaca = document.querySelector('#prom_hojas_paca');
        var inputCantFundasPaca = document.querySelector('#cant_fundas_paca');

        // Calcular el promedio de hojas por paca
        function calcularPromHojasPaca() {
            var cantGavillasPaca = parseFloat(inputCantGavillasPaca.value);
            var promGavillas = parseFloat(inputPromGavillas.value);
            
            var promHojasPaca = cantGavillasPaca * promGavillas;
            inputPromHojasPaca.value = promHojasPaca.toFixed(2);
    
            calcularCantFundasPaca();
        }
    
        // Calcular la cantidad de fundas por paca
        function calcularCantFundasPaca() {
            var promHojasPaca = parseFloat(inputPromHojasPaca.value);
            var hojasFundas = parseFloat(inputHojasFundas.value);
    
            if (hojasFundas !== 0) {
                var cantFundasPaca = promHojasPaca / hojasFundas;
                inputCantFundasPaca.value = cantFundasPaca.toFixed(2);
            } else {
                inputCantFundasPaca.value = '';
            }
        }
    
        // Calcular hojas fundas y división
        function calcularHojasFundasYDivision() {
            var hojasGavillas = parseInt(inputHojasGavillas.value);
            var gavillasFunda = parseInt(inputGavillasFunda.value);
            var promedioGavillas = parseFloat(inputPromGavillas.value);
            
            var resultadoHojasFundas = hojasGavillas * gavillasFunda;
            inputHojasFundas.value = resultadoHojasFundas;
    
            if (promedioGavillas !== 0) {
                var divisionResultado = resultadoHojasFundas / promedioGavillas;
                inputDivision.value = divisionResultado.toFixed(2);
                calcularCantFundasPaca();
            } else {
                inputDivision.value = '';
                inputCantFundasPaca.value = '';
            }
        }
    
        // Actualizar variedades según la clase seleccionada
        function actualizarVariedades() {
            var claseSeleccionada = selectClase.value;
            var opcionesGeneradas = '';
    
            if (claseSeleccionada) {
                var variedadesClase = infoVariedad[claseSeleccionada.toLowerCase()][0].Variedad;
    
                opcionesGeneradas += `<optgroup label="${claseSeleccionada}">`;
                for (var i = 0; i < variedadesClase.length; i++) {
                    opcionesGeneradas += `
                        <option value="${variedadesClase[i].nombre}" data-gavillas="${variedadesClase[i].gavillas_funda}" data-hojas-gavillas="${variedadesClase[i].hojas_gavillas}">
                            ${variedadesClase[i].nombre}
                        </option>`;
                }
                opcionesGeneradas += '</optgroup>';
            }
    
            selectVariedad.innerHTML = opcionesGeneradas;
            calcularHojasFundasYDivision();
        }
    
        var inputMuestraGavillasSumatra = document.getElementById('muestra_gavillas_sumatra');
        var inputGavillaFundaSumatra = document.getElementById('gavilla_funda_sumatra');
        var inputCantGavillasPacaSumatra = document.getElementById('cant_gavillas_paca_sumatra');
        var inputPesoFunda = document.getElementById('peso_funda_sumatra');
    
        // Funcion para calcular el peso por funda
        function calcularPesoFunda() {
            var muestraGavillasSumatra = parseInt(inputMuestraGavillasSumatra.value);
            var gavillaFundaSumatra = parseFloat(inputGavillaFundaSumatra.value);
    
            if (!isNaN(muestraGavillasSumatra) && !isNaN(gavillaFundaSumatra) && muestraGavillasSumatra !== 0) {
                var resultado1 = (gavillaFundaSumatra / muestraGavillasSumatra).toFixed(1);
                var resultado2 = (resultado1 / muestraGavillasSumatra).toFixed(1);
                var pesoFunda = (resultado1 * resultado2).toFixed(2);
    
                inputPesoFunda.value = pesoFunda;
            } else {
                inputPesoFunda.value = '';
            }
        }
    
        inputMuestraGavillasSumatra.addEventListener('input', calcularPesoFunda);
        inputGavillaFundaSumatra.addEventListener('input', calcularPesoFunda);
    
        // Función para calcular la cantidad de gavillas por paca (Sumatra tripa)
        var inputCantFundasPacaSumatra = document.getElementById('cant_fundas_paca_sumatra');
    
        function calcularCantGavillasPacaSumatra() {
            var cantFundasPacaSumatra = parseFloat(inputCantFundasPacaSumatra.value);
            var gavillaFundaSumatra = parseFloat(inputGavillaFundaSumatra.value);
    
            if (!isNaN(cantFundasPacaSumatra) && !isNaN(gavillaFundaSumatra) && gavillaFundaSumatra !== 0) {
                var cantGavillasPacaSumatra = cantFundasPacaSumatra * gavillaFundaSumatra;
                inputCantGavillasPacaSumatra.value = cantGavillasPacaSumatra.toFixed(2);
            } else {
                inputCantGavillasPacaSumatra.value = '';
            }
        }
    
        inputCantFundasPacaSumatra.addEventListener('input', calcularCantGavillasPacaSumatra);
        inputGavillaFundaSumatra.addEventListener('input', calcularCantGavillasPacaSumatra);
    
        // Event listeners
        inputCantGavillasPaca.addEventListener('input', calcularPromHojasPaca);
        inputPromGavillas.addEventListener('input', calcularPromHojasPaca);
        inputHojasGavillas.addEventListener('input', calcularHojasFundasYDivision);
        inputGavillasFunda.addEventListener('input', calcularHojasFundasYDivision);
    
        selectVariedad.addEventListener('change', function() {
            var selectedOption = selectVariedad.options[selectVariedad.selectedIndex];
            var gavillasInfo = selectedOption.getAttribute('data-gavillas');
            var hojasGavillasInfo = selectedOption.getAttribute('data-hojas-gavillas');
        
            inputGavillasFunda.value = gavillasInfo;
            inputHojasGavillas.value = hojasGavillasInfo;
            calcularHojasFundasYDivision();
            calcularPromHojasPaca();
    
            // Obtener el valor de la variedad seleccionada
            var variedadSeleccionada = selectedOption.value;
    
            // Mostrar u ocultar campos según la variedad seleccionada
            var varietyDetailsDiv = document.getElementById('varietyDetails');
            var OcultarDiv = document.getElementById('Ocultar');
            var muestraGavillasSumatraField = document.getElementById('muestraGavillasSumatraField');
            var gavillaFundaSumatraField = document.getElementById('gavillaFundaSumatraField');
            var pesoFundaField = document.getElementById('pesoFundaField');
            var CantFundasPacaSumatraField = document.getElementById('CantFundasPacaSumatraField');
            var CantGavillasPacaSumatraField = document.getElementById('CantGavillasPacaSumatraField');
            var promHojasPacaField = document.getElementById('prom_hojas_paca');
            var promHojasPacaLabel = document.querySelector('[for="prom_hojas_paca"]');
            var cantFundasPacaField = document.getElementById('cant_fundas_paca');
            var cantFundasPacaLabel = document.querySelector('[for="cant_fundas_paca"]');
    
            if (variedadSeleccionada === "Sumatra tripa") {

            //Ocultar y mostrar los valores necesarios
            varietyDetailsDiv.style.display = 'none';
            OcultarDiv.style.display = 'none';
            muestraGavillasSumatraField.style.display = 'block';
            gavillaFundaSumatraField.style.display = 'block';
            pesoFundaField.style.display = 'block';
            CantFundasPacaSumatraField.style.display = 'block';
            CantGavillasPacaSumatraField.style.display = 'block';
            promHojasPacaField.style.display = 'none';
            cantFundasPacaField.style.display = 'none';
            promHojasPacaLabel.style.display = 'none';
            cantFundasPacaLabel.style.display = 'none';

            //Establecer por defecto los valores que no son requeridos
            inputPromGavillas.value = 0;
            inputDivision.value = 0;
            inputCantGavillasPaca.value = 0;
            inputPromHojasPaca.value = 0;
            inputCantFundasPaca.value = 0;

            // Habilitar la validación requerida para los campos específicos
            inputMuestraGavillasSumatra.required = true;
            inputGavillaFundaSumatra.required = true;
            inputCantFundasPacaSumatra.required = true;

            // Deshabilitar la validación requerida para otros campos específicos
            inputPromGavillas.required = false;
            inputCantGavillasPaca.required = false;

            } else {
            varietyDetailsDiv.style.display = 'flex'; 
            OcultarDiv.style.display = 'flex';
            muestraGavillasSumatraField.style.display = 'none';
            gavillaFundaSumatraField.style.display = 'none';
            pesoFundaField.style.display = 'none';
            CantFundasPacaSumatraField.style.display = 'none';
            CantGavillasPacaSumatraField.style.display = 'none';
            promHojasPacaField.style.display = 'block';
            cantFundasPacaField.style.display = 'block';
            promHojasPacaLabel.style.display = 'block';
            cantFundasPacaLabel.style.display = 'block';

            // Habilitar la validación requerida para otros campos específicos
            inputPromGavillas.required = true;
            inputCantGavillasPaca.required = true;

            // Deshabilitar la validación requerida para los campos específicos de Sumatra tripa
            inputMuestraGavillasSumatra.required = false;
            inputGavillaFundaSumatra.required = false;
            inputCantFundasPacaSumatra.required = false;
            }
      
        });
        selectClase.addEventListener('change', actualizarVariedades);

        // Event listeners para cambios en gavillas y hojas
        inputHojasGavillas.addEventListener('input', calcularHojasFundasYDivision);
        inputGavillasFunda.addEventListener('input', calcularHojasFundasYDivision);
        inputPromGavillas.addEventListener('input', calcularHojasFundasYDivision);
    
        // Llama a la función de inicialización
        actualizarVariedades();
});