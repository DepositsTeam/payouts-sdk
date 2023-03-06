// For any validations
(function () {
    'use strict'

    const credential_form = document.querySelector('.credential-form')
    const link_form = document.querySelector('.link-form')
    const credential_btn = document.querySelector('.credential-btn')
    const link_btn = document.querySelector('.link-btn')

    link_btn.addEventListener('click', e => {
        e.preventDefault()

        credential_form.style.display = "none"
        link_form.style.display = "block"
    })

    credential_btn.addEventListener('click', e => {
        e.preventDefault()

        credential_form.style.display = "block"
        link_form.style.display = "none"
    })

    credential_form.addEventListener('submit', event => {
        event.preventDefault()
        event.stopPropagation()

        if (!credential_form.checkValidity()) {
            alert("All fields are required!!!")
            return
        }

        const public_key = credential_form.querySelector('#public_key').value
        const access_id = credential_form.querySelector('#access_id').value
        const entity_type = credential_form.querySelector('#entity_type').value

        DepositsKysync({
            public_key,
            access_id,
            redirect_url: "https://ondeposits.com",
            entity_type,
            callback: (data) => {
                console.log("callback", data);
            },
        });
    })

    link_form.addEventListener('submit', event => {
        event.preventDefault()
        event.stopPropagation()

        if (!link_form.checkValidity()) {
            alert("All fields are required!!!")
            return
        }

        const url = link_form.querySelector('#url').value
        const url_array = url.split("/")

        const public_key = url_array[3]
        const access_id = url_array[5]
        const entity_type = url_array[4]

        DepositsKysync({
            public_key,
            access_id,
            redirect_url: "https://ondeposits.com",
            entity_type,
            callback: (data) => {
                console.log("callback", data);
            },
        });
    })
})()
