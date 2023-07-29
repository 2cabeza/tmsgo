LOGISTICS GO
============

Sistema de administración de transporte

Instalación y despliegue
========================

Entorno virtual
===============

Se crea el virtualenv dentro del directorio: ::

    pythonx.x -m venv .venv
    source .venv/bin/activate

Se instalan los requerimientos con el virtualenv activo: ::

    pip install -r requirements.txt

Git flow
--------

Se recomienda el uso de git flow. Para instalar: ::

    sudo apt install git-flow

Luego en la raíz del proyecto, ejecutar: ::

    git flow init

Para mayor información visitar `https://danielkummer.github.io/git-flow-cheatsheet/index.es_ES.html
<https://danielkummer.github.io/git-flow-cheatsheet/index.es_ES.html>`_.


Envío de correos
================

Se escribió una función para poder enviar correos fácilmente a través de Sendgrid en ``logics/utils.py``.

**Nota**: Se protege el envío de correos desde servidor local. Para activarlos se debe desactivar el modo ``DEBUG`` en ``config/local_settings.py``.

Ejemplo 1::

    from hxc.utils import sendmail

    sendmail('Asunto', 'texto', ['destinatario@mail.com'])


Ejemplo 2::

    from hxc.utils import sendmail

    sendmail('Asunto', 'texto', ['correo@mail.com'], 'Nombre <desde@mail.com>',
             {'%username%': 'nombre_de_usuario'}, 'sendgrid_template_id',
             ("<p>This is a simple HTML email body</p>", "text/html"))

Ejemplo 3::

    from hxc.utils import sendmail

    sendmail(
        subject='Asunto',
        body='texto',
        to=['destinatario@mail.com'],
        from='Nombre <desde@mail.com>',
        substitutions={'%username%': 'nombre_de_usuario'},
        template_id='sendgrid_template_id',
        attach_alternative=("<p>This is a simple HTML email body</p>",
                            "text/html")
    )

LOCALE
======

Para activar la traducción en español (es-es), se debe ejecutar: ::

     django-admin.py compilemessages
     Traducir los textos generados
     ./manage.py compilemessages -l es

