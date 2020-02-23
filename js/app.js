/* Petición AJAX */

function request(url) {
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.timeout = 2000;
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(xhr.response);
                } else {
                    reject(xhr.status);
                }
            }
        };
        xhr.ontimeout = function () {
            reject('timeout')
        };
        xhr.open('get', url, true);
        xhr.setRequestHeader("x-api-key", "b2a67d10-2fe7-4cf9-a264-d30611e17dbe");
        xhr.send();
    });
}

var pag = document.getElementById("numeropagina").value;

/* Evento del botón */

document.getElementById("boton").addEventListener("click", () => {

    var catID = document.getElementById("gato").value;
    var imagenes = 'https://api.thecatapi.com/v1/images/search?category_ids=' + catID + '&limit=12&page=1&order=DESC';
    document.getElementById("numeropagina").value = "1";
    pag = document.getElementById("numeropagina").value;
    document.getElementById("anterior").style.display = 'none';
    const myPromise2 = request(imagenes);

    myPromise2
        .then(function boton(json) {
            const listGato = JSON.parse(json);
            document.getElementById("gatos").innerHTML = "";
            listGato.forEach(gato => document.getElementById("gatos").innerHTML += "<div class='container w-25 p-2'><img src=" + gato.url + " class='img-fluid'></div>");
        })
        .catch(function handleErrors(error) {
            console.log('when a reject is executed it will come here ignoring the then statement ', error)
            document.getElementById("error").innerHTML = '<div class="alert alert-danger">Algo ha ido mal. Consulta con el administrador o prueba a recargar la página.</div>';
        })

    document.getElementById("siguiente").style.display = 'block';
    for (let i = 0; i < document.getElementsByTagName('li').length; i++) {
        if (document.getElementsByTagName('li')[i].textContent == pag) {
            document.getElementsByTagName('li')[i].className = 'page-item active';
        } else {
            document.getElementsByTagName('li')[i].className = 'page-item';
        }
    }
});

/* Promesa de las categorias */

const categorias = 'https://api.thecatapi.com/v1/categories';
const promesaCategorias = request(categorias);


promesaCategorias
    .then(function categorias(json) {
        const listGato = JSON.parse(json);
        listGato.forEach(gato => document.getElementById("gato").innerHTML += "<option value=" + gato.id + ">" + gato.name + "</option>");

    })
    .catch(function handleErrors(error) {
        console.log('when a reject is executed it will come here ignoring the then statement ', error)
        document.getElementById("error").innerHTML = '<div class="alert alert-danger">Algo ha ido mal. Consulta con el administrador o prueba a recargar la página.</div>';
    })

/* Primera carga de imágenes */

const promesaImagenes = request('https://api.thecatapi.com/v1/images/search?category_ids=5&limit=12&page=1&order=DESC');

window.onload = promesaImagenes
    .then(function ponerImagenes(json) {
        const listGato = JSON.parse(json);
        document.getElementById("gatos").innerHTML = "";
        listGato.forEach(gato => document.getElementById("gatos").innerHTML += "<div class='container w-25 p-2'><img src=" + gato.url + " class='img-fluid'></div>");
        document.getElementById("anterior").style.display = 'none';
    })
    .catch(function handleErrors(error) {
        console.log('when a reject is executed it will come here ignoring the then statement ', error);
        document.getElementById("error").innerHTML = '<div class="alert alert-danger">Algo ha ido mal. Consulta con el administrador o prueba a recargar la página.</div>';
    })

/* Paginación */

const paginas = document.querySelector("ul.pagination");

paginas.addEventListener("click", (event) => {
    var catID = document.getElementById("gato").value;
    if (event.target.textContent === "Anterior" && pag != '1') {
        document.getElementById("siguiente").style.display = 'block';
        pag = (parseInt(pag) - 1);
        document.getElementById("numeropagina").value = pag.toString();
        var imagenes = 'https://api.thecatapi.com/v1/images/search?category_ids=' + catID + '&limit=12&page=' + pag + '&order=DESC';
        const promesaPagina = request(imagenes);
        if (pag == '1') {
            document.getElementById("anterior").style.display = 'none';
            document.getElementById("siguiente").style.display = 'block';
        }
        promesaPagina
            .then(function cambiarPagina(json) {
                const listGato = JSON.parse(json);
                document.getElementById("gatos").innerHTML = "";
                listGato.forEach(gato => document.getElementById("gatos").innerHTML += "<div class='container w-25 p-2'><img src=" + gato.url + " class='img-fluid'></div>");
            }).catch(function handleErrors(error) {
                console.log('when a reject is executed it will come here ignoring the then statement ', error);
                document.getElementById("error").innerHTML = '<div class="alert alert-danger">Algo ha ido mal. Consulta con el administrador o prueba a recargar la página.</div>';
            })
    } else if (event.target.textContent === "Siguiente" && pag != '5') {
        document.getElementById("anterior").style.display = 'block';
        pag = (parseInt(pag) + 1);
        document.getElementById("numeropagina").value = pag.toString();
        var imagenes = 'https://api.thecatapi.com/v1/images/search?category_ids=' + catID + '&limit=12&page=' + pag + '&order=DESC';
        const promesaPagina = request(imagenes);
        if (pag == '5') {
            document.getElementById("siguiente").style.display = 'none';
            document.getElementById("anterior").style.display = 'block';
        }
        promesaPagina
            .then(function cambiarPagina(json) {
                const listGato = JSON.parse(json);
                document.getElementById("gatos").innerHTML = "";
                listGato.forEach(gato => document.getElementById("gatos").innerHTML += "<div class='container w-25 p-2'><img src=" + gato.url + " class='img-fluid'></div>");
            }).catch(function handleErrors(error) {
                console.log('when a reject is executed it will come here ignoring the then statement ', error);
                document.getElementById("error").innerHTML = '<div class="alert alert-danger">Algo ha ido mal. Consulta con el administrador o prueba a recargar la página.</div>';
            })
    } else {
        pag = parseInt(event.target.textContent);
        document.getElementById("numeropagina").value = pag.toString();
        var imagenes = 'https://api.thecatapi.com/v1/images/search?category_ids=' + catID + '&limit=12&page=' + pag + '&order=DESC';
        if (document.getElementById("numeropagina").value == '5') {
            document.getElementById("siguiente").style.display = 'none';
            document.getElementById("anterior").style.display = 'block';
        } else if (document.getElementById("numeropagina").value == '1') {
            document.getElementById("anterior").style.display = 'none';
            document.getElementById("siguiente").style.display = 'block';
        } else {
            document.getElementById("anterior").style.display = 'block';
            document.getElementById("siguiente").style.display = 'block';
        }
        const promesaPagina = request(imagenes);
        promesaPagina
            .then(function cambiarPagina(json) {
                const listGato = JSON.parse(json);
                document.getElementById("gatos").innerHTML = "";
                listGato.forEach(gato => document.getElementById("gatos").innerHTML += "<div class='container w-25 p-2'><img src=" + gato.url + " class='img-fluid'></div>");
            }).catch(function handleErrors(error) {
                console.log('when a reject is executed it will come here ignoring the then statement ', error);
                document.getElementById("error").innerHTML = '<div class="alert alert-danger">Algo ha ido mal. Consulta con el administrador o prueba a recargar la página.</div>';
            })
    }
    for (let i = 0; i < document.getElementsByTagName('li').length; i++) {
        if (document.getElementsByTagName('li')[i].textContent == pag) {
            document.getElementsByTagName('li')[i].className = 'page-item active';
        } else {
            document.getElementsByTagName('li')[i].className = 'page-item';
        }
    }
});