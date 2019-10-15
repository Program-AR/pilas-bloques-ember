import Component from '@ember/component';

export default Component.extend({

    actions: {
        createIssue() {
            fetch('https://api.github.com/repos/Program-AR/pilas-bloques/issues', {
                method: 'POST',
                headers: {
                    'Authorization': 'token 417a27862c9bbb720a908a96554282bfae973f99'
                },
                body: JSON.stringify({ title: this.get("title"), body: this.get("problem") + "\nEnviado por " + "<b>" + this.get("name") + "</b> (" + this.get("email") + ")" + " desde Pilas Bloques." })
            }).catch(function (err) {
                console.error(err);
            });
            this.send("cerrarReporteProblemas");
        }
    }

});
