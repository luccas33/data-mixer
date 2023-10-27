# Data Mixer

Algoritimo de geração de dados para popular bases de teste com formato personalizado.

A partir de um objeto modelo, contendo instruções e dados simples iniciais, este algorítimo é capaz de gerar dados complexos em qualquer estrutura.

Este projeto também contém um algoritimo para converter dados em JSON para insert SQL de forma relacional.

## Demonstração Básica

### Este código...

```Javascript
let clientes = ['João', 'Maria', 'Pedro', 'José', 'Carla'];

let produtos = ['Arroz', 'Feijão', 'Óleo', 'Macarrão', 'Carne', 'Tomate', 'Alface', 'Pão', 'Leite', 'Café'];

function converterPreco(preco) {
    return preco / 100;
}

let modeloItemVenda = {
    produto: {origin: produtos},
    preco: {max: 2000, converter: converterPreco},
    quantidade: {max: 5}
};

function totalizarVenda(venda) {
    let total = 0;
    venda.item_venda.forEach(iv => total += iv.preco * iv.quantidade);
    return total;
}

let modeloVenda = {
    cliente: {origin: clientes},
    data: {min: new Date(2022, 0, 1), max: new Date(2022, 11, 31), converter: datetimeToString},
    item_venda: {
        min: 2,
        max: 5,
        repeat: false,
        idProperty: 'produto',
        origin: modeloItemVenda
    },
    total: {origin: totalizarVenda}
};

let saida = JSON.stringify(generate(modeloVenda));
```

### ...gerou esta saída:

```JSON
{
  "cliente": "José",
  "data": "2022-01-03 08:18:45",
  "item_venda": [
    { "produto": "Leite", "preco": 12.81, "quantidade": 1 },
    { "produto": "Carne", "preco": 3.36, "quantidade": 1 },
    { "produto": "Pão", "preco": 14.75, "quantidade": 2 }
  ],
  "total": 45.67
}
```

### JSON convertido para insert SQL:

```SQL
insert into `venda` (`cliente`, `data`, `total`, `id_venda`) values ('José', '2022-01-03 08:18:45', 45.67, 1);
insert into `item_venda` (`produto`, `preco`, `quantidade`, `id_venda`, `id_item_venda`) values ('Leite', 12.81, 1, 1, 1);
insert into `item_venda` (`produto`, `preco`, `quantidade`, `id_venda`, `id_item_venda`) values ('Carne', 3.36, 1, 1, 2);
insert into `item_venda` (`produto`, `preco`, `quantidade`, `id_venda`, `id_item_venda`) values ('Pão', 14.75, 2, 1, 3);
```

## Tutorial

### Propriedades do objeto modelo:
- `min`: valor mínimo. Valor padrão = 1;
- `max`: valor máximo. Valor padrão = 1;
- `origin`: origem dos dados;
- `repeat`: os valores podem se repetir. Valor padrão = true;
- `idProperty`: nome da propriedade única do objeto gerado;
- `converter`: Function para tratar o dado depois de gerado.

### Como executar

```Javascript
let objetoGerado = generate( objetoModelo );

let inserts = jsonToSql( objetoGerado, 'nomeTabelaPrincipal' );
```

### Min e Max

`min` e `max` podem ser um number, um Date ou uma Function.
Caso min/max seja uma Function, a Function é executada e o valor de retorno é usado como min/max.

### Origin

`origin` pode ser null, um array, um objeto a ser gerado (modelo) ou uma Function.
Caso origin seja null, será gerado um valor aleatório entre min e max;
Caso origin seja um array, um valor do array será selecionado aleatoriamente;
Caso origin seja um objeto modelo, o objeto é gerado e retornado para a propriedade em questão.
Caso origin seja uma Funcion, a Funcion é executada e seu valor de retorno é enviado para a propriedade em
questão.

### Functions

- As functions de origin e min/max recebem o objeto que está sendo gerado como argumento. E os objetos modelos filhos recebem o objeto pai na propriedade super.

- As functions de converter recebem o valor gerado no argumento e devem retornar o valor tratado.
Functions de converter disponíveis: dateToString, timeToString, datetimeToString.

### Functions Utilitárias

- random(min, max): gera um valor inteiro entre min e max

- round(valor, casasDecimais): arredonda um valor
