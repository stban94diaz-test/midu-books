const checkIsNavigationSupported = () => {
  return Boolean(document.startViewTransition)
}

const fetchPage = async (url: string) => {
  // vamos a cargar la página de destino
  // utilizando un fetch para obtener el HTML
  const response = await fetch(url); // clean-code
  const text = await response.text();
  // quedarnos solo con el contenido del html dentro de la etiqueta body
  // usamos un regex para extraerlo
  const [, data] = text.match(/<body[^>]*>([\s\S]*)<\/body>/i) || [];
  return data;
}

export const startViewTransition = () => {
  if (!checkIsNavigationSupported()) return

  (window as any).navigation.addEventListener("navigate", (event: any) => {
    const toURL = new URL(event.destination.url);

    // es una página externa? si es asi, lo ignoramos
    if (location.origin !== toURL.origin) return;

    // si es una navegacion en el mismo dominio (origen)
    event.intercept({
      async handler() {
        const data = await fetchPage(toURL.pathname)

        document.startViewTransition(() => {
          // Como tiene que actualizar la vista
          document.body.innerHTML = data;
          // el scroll hacia arriba del todo
          document.documentElement.scrollTop = 0;
        });
      },
    });
  });
}
