"use client"

import MainContainer from "@/components/containers/main-container";
import { Add, Delete } from "@mui/icons-material";
import { Box, Container, Divider, IconButton, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useState } from "react";


type BrandQuote = {
    brand: string;
    priceKG: number;
};

type Ingredient = {
    id: number;
    name: string;
    unit: string;
    perPizza: { [pizzaType: string]: number }; // Quantidade por pizza de cada tipo
    quotes: BrandQuote[]; // Até 3 orçamentos
    selectedBrand: string; // Marca selecionada
};

// Tipos de pizza
const pizzaTypes = [
    { key: "marguerita", label: "Marguerita" },
    { key: "calabresa", label: "Calabresa" },
    { key: "toscana", label: "Toscana" },
    { key: "gorgonzola", label: "Gorgonzola" },
];

// Ingredientes iniciais adaptados
const initialIngredients: Ingredient[] = [
    {
        id: 1,
        name: "Farinha de trigo",
        unit: "g",
        perPizza: { marguerita: 200, calabresa: 200, toscana: 200, gorgonzola: 200 },
        quotes: [
            { brand: "Dona Benta", priceKG: 6 },
            { brand: "", priceKG: 0 },
            { brand: "", priceKG: 0 },
        ],
        selectedBrand: "Dona Benta",
    },
    {
        id: 2,
        name: "Semolina",
        unit: "g",
        perPizza: { marguerita: 20, calabresa: 20, toscana: 20, gorgonzola: 20 },
        quotes: [
            { brand: "Renata", priceKG: 9 },
            { brand: "", priceKG: 0 },
            { brand: "", priceKG: 0 },
        ],
        selectedBrand: "Renata",
    },
    { id: 3, name: "Fermento seco", unit: "g", perPizza: { marguerita: 4, calabresa: 4, toscana: 4, gorgonzola: 4 }, quotes: [ { brand: "Fleischmann", priceKG: 180 }, { brand: "", priceKG: 0 }, { brand: "", priceKG: 0 }, ], selectedBrand: "Fleischmann", },
    { id: 4, name: "Queijo mussarela", unit: "g", perPizza: { marguerita: 120, calabresa: 100, toscana: 140, gorgonzola: 80 }, quotes: [ { brand: "Tirolez", priceKG: 25 }, { brand: "", priceKG: 0 }, { brand: "", priceKG: 0 }, ], selectedBrand: "Tirolez", },
    { id: 5, name: "Queijo provolone", unit: "g", perPizza: { marguerita: 40, calabresa: 60, toscana: 20, gorgonzola: 10 }, quotes: [ { brand: "Polenghi", priceKG: 38 }, { brand: "", priceKG: 0 }, { brand: "", priceKG: 0 }, ], selectedBrand: "Polenghi", },
    { id: 6, name: "Linguiça toscana", unit: "g", perPizza: { marguerita: 50, calabresa: 70, toscana: 30, gorgonzola: 10 }, quotes: [ { brand: "Seara", priceKG: 24 }, { brand: "", priceKG: 0 }, { brand: "", priceKG: 0 }, ], selectedBrand: "Seara", },
    { id: 7, name: "Tomate cereja", unit: "un", perPizza: { marguerita: 5, calabresa: 3, toscana: 4, gorgonzola: 2 }, quotes: [ { brand: "Cereja", priceKG: 15 }, { brand: "", priceKG: 0 }, { brand: "", priceKG: 0 }, ], selectedBrand: "Cereja", },
    { id: 8, name: "Manjericão", unit: "folha", perPizza: { marguerita: 5, calabresa: 2, toscana: 3, gorgonzola: 1 }, quotes: [ { brand: "Manjericão Fresco", priceKG: 4 }, { brand: "", priceKG: 0 }, { brand: "", priceKG: 0 }, ], selectedBrand: "Manjericão Fresco", },
    { id: 9, name: "Pasta rústica de tomate", unit: "g", perPizza: { marguerita: 30, calabresa: 20, toscana: 25, gorgonzola: 15 }, quotes: [ { brand: "Pomodoro", priceKG: 22 }, { brand: "", priceKG: 0 }, { brand: "", priceKG: 0 }, ], selectedBrand: "Pomodoro", },
];


const Index = () => {

    const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);

    // Outros insumos
    const [extraCosts, setExtraCosts] = useState<{
        id: number;
        name: string;
        value: number;
    }[]>([
        { id: 1, name: "Água, azeite, sal", value: 0.3 },
        { id: 2, name: "Embalagem a vácuo", value: 1.4 }
    ]);
    // Máquinas
    const [equipments, setEquipments] = useState<{
        id: number;
        name: string;
        price: number;
        installments: number;
    }[]>([
        { id: 1, name: "Forno a gás p/ 1 pizza", price: 2800, installments: 10 },
        { id: 2, name: "Masseira espiral 10kg", price: 4500, installments: 10 },
        { id: 3, name: "Seladora a vácuo", price: 1300, installments: 10 },
        { id: 4, name: "Utensílios & assadeiras", price: 800, installments: 1 }
    ]);
    // Custos fixos operacionais
    const [fixedCosts, setFixedCosts] = useState<{
        id: number;
        name: string;
        value: number;
    }[]>([
        { id: 1, name: "Botijão de gás P13 (mensal)", value: 240 },
        { id: 2, name: "Energia elétrica (mensal)", value: 90 },
        { id: 3, name: "Delivery (apps, fixo ou %)", value: 300 },
        { id: 4, name: "Outros custos fixos", value: 100 },
    ]);
    // Parâmetros do negócio
    const [pizzaParams, setPizzaParams] = useState({
        marguerita: { price: 38, month: 50 },
        calabresa: { price: 40, month: 60 },
        toscana: { price: 42, month: 50 },
        gorgonzola: { price: 45, month: 40 },
    });
    // Controle de edição/adição
    const [newIngredient, setNewIngredient] = useState({ name: "", unit: "g", perPizza: "", priceKG: "" });
    const [newExtra, setNewExtra] = useState({ name: "", value: "" });
    const [newEquipment, setNewEquipment] = useState({ name: "", price: "", installments: "" });
    const [newFixedCost, setNewFixedCost] = useState({ name: "", value: "" });

    // ----- Lógicas de custo -----

    // Handler para alterar orçamento/marca
    const handleQuoteChange = (ingId, quoteIdx, field, value) => {
        setIngredients(ingredients.map(ing => {
            if (ing.id !== ingId) return ing;
            const quotes = ing.quotes.map((q, i) =>
                i === quoteIdx ? { ...q, [field]: value } : q
            );
            return { ...ing, quotes };
        }));
    };

    // Handler para selecionar marca
    const handleBrandSelect = (ingId, brand) => {
        setIngredients(ingredients.map(ing =>
            ing.id === ingId ? { ...ing, selectedBrand: brand } : ing
        ));
    };

    // Handler para alterar quantidade por pizza
    const handlePerPizzaChange = (ingId, pizzaType, value) => {
        setIngredients(ingredients.map(ing =>
            ing.id === ingId
                ? { ...ing, perPizza: { ...ing.perPizza, [pizzaType]: Number(value) } }
                : ing
        ));
    };

    // Handler para alterar preço de venda/quantidade de cada pizza
    const handlePizzaParamChange = (pizzaType, field, value) => {
        setPizzaParams({
            ...pizzaParams,
            [pizzaType]: { ...pizzaParams[pizzaType], [field]: Number(value) }
        });
    };

    // Cálculo do custo de ingredientes por pizza considerando marca selecionada
    const ingredientCostPerPizza = (pizzaType: string) =>
        ingredients.reduce((acc, ing) => {
            const quote = ing.quotes.find(q => q.brand === ing.selectedBrand) || ing.quotes[0];
            const priceKG = quote.priceKG || 0;
            const qty = ing.perPizza[pizzaType] || 0;
            // Adapte regras especiais se necessário
            return acc + ((qty / 1000) * priceKG);
        }, 0);

    // Cálculo de custos e resultados por pizza
    const results = pizzaTypes.map(pt => {
        const key = pt.key;
        const price = pizzaParams[key].price;
        const month = pizzaParams[key].month;
        const ingrCost = ingredientCostPerPizza(key);
        const extra = extraCosts.reduce((sum, e) => sum + Number(e.value), 0);
        const totalCost = ingrCost + extra;
        const revenue = price * month;
        const variable = totalCost * month;
        return {
            key,
            label: pt.label,
            price,
            month,
            ingrCost,
            totalCost,
            revenue,
            variable,
        };
    });
    const totalRevenue = results.reduce((s, r) => s + r.revenue, 0);
    const totalVariable = results.reduce((s, r) => s + r.variable, 0);
    const fixedCostMonth = fixedCosts.reduce((s, c) => s + Number(c.value), 0);
    const grossProfit = totalRevenue - totalVariable - fixedCostMonth;
    const marginPercent = ((grossProfit / totalRevenue) * 100).toFixed(2);
    const totalEquipment = equipments.reduce((sum, eq) => sum + Number(eq.price), 0);
    const payback = grossProfit > 0 ? (totalEquipment / grossProfit).toFixed(1) : "--";

    // --- Handlers CRUD ---

    // Ingredientes
    const handleIngredientChange = (id, field, value) => {
        setIngredients(ingredients.map(ing =>
            ing.id === id ? { ...ing, [field]: value } : ing
        ));
    };
    const addIngredient = () => {
        if (!newIngredient.name || !newIngredient.perPizza || !newIngredient.priceKG) return;
        setIngredients([
            ...ingredients,
            { id: Date.now(), ...newIngredient, perPizza: Number(newIngredient.perPizza), priceKG: Number(newIngredient.priceKG), }
        ]);
        setNewIngredient({ name: "", unit: "g", perPizza: "", priceKG: "" });
    };
    const deleteIngredient = (id) => setIngredients(ingredients.filter(x => x.id !== id));

    // Extras
    const handleExtraChange = (id, field, value) =>
        setExtraCosts(extraCosts.map(e => e.id === id ? { ...e, [field]: value } : e));
    const addExtra = () => {
        if (!newExtra.name || !newExtra.value) return;
        setExtraCosts([...extraCosts, { id: Date.now(), ...newExtra, value: Number(newExtra.value) }]);
        setNewExtra({ name: "", value: "" });
    };
    const deleteExtra = id => setExtraCosts(extraCosts.filter(x => x.id !== id));

    // Equipamentos
    const handleEquipmentChange = (id, field, value) =>
        setEquipments(equipments.map(e => e.id === id ? { ...e, [field]: value } : e));
    const addEquipment = () => {
        if (!newEquipment.name || !newEquipment.price || !newEquipment.installments) return;
        setEquipments([...equipments, { id: Date.now(), ...newEquipment, price: Number(newEquipment.price), installments: Number(newEquipment.installments) }]);
        setNewEquipment({ name: "", price: "", installments: "" });
    };
    const deleteEquipment = id => setEquipments(equipments.filter(x => x.id !== id));

    // Custos Fixos
    const handleFixedCostChange = (id, field, value) =>
        setFixedCosts(fixedCosts.map(f => f.id === id ? { ...f, [field]: value } : f));
    const addFixedCost = () => {
        if (!newFixedCost.name || !newFixedCost.value) return;
        setFixedCosts([...fixedCosts, { id: Date.now(), ...newFixedCost, value: Number(newFixedCost.value) }]);
        setNewFixedCost({ name: "", value: "" });
    };
    const deleteFixedCost = id => setFixedCosts(fixedCosts.filter(x => x.id !== id));

    return (

        <MainContainer>
            <Container maxWidth="xl" sx={{ pb: 8 }}>
                <Box sx={{ my: 4 }}>
                    <Typography variant="h3" color="primary" align="center" gutterBottom>
                        Planejamento Estratégico - Pizzaria Entre Amigos
                    </Typography>
                    <Typography align="center" color="text.secondary" gutterBottom>
                        Simulador de Viabilidade | Tudo dinâmico para seu planejamento!
                    </Typography>
                </Box>
                <Paper sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h5" color="secondary" gutterBottom>1. Parâmetros de Venda por Pizza</Typography>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Pizza</TableCell>
                                    <TableCell align="right">Preço venda (R$)</TableCell>
                                    <TableCell align="right">Qtd/mês</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pizzaTypes.map(pt => (
                                    <TableRow key={pt.key}>
                                        <TableCell>{pt.label}</TableCell>
                                        <TableCell align="right">
                                            <TextField
                                                type="number"
                                                value={pizzaParams[pt.key].price}
                                                onChange={e => handlePizzaParamChange(pt.key, "price", e.target.value)}
                                                size="small"
                                                sx={{ width: 80 }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <TextField
                                                type="number"
                                                value={pizzaParams[pt.key].month}
                                                onChange={e => handlePizzaParamChange(pt.key, "month", e.target.value)}
                                                size="small"
                                                sx={{ width: 80 }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
                {/* Ingredientes por pizza */}
                <Paper sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h5" color="secondary" gutterBottom>
                        2. Ingredientes por Pizza (até 3 orçamentos por item)
                    </Typography>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell rowSpan={2} sx={{ minWidth: 120, fontWeight: 'bold' }}>Ingrediente</TableCell>
                                    <TableCell rowSpan={2} sx={{ minWidth: 60, fontWeight: 'bold' }}>Unidade</TableCell>
                                    {pizzaTypes.map(pt => (
                                        <TableCell key={pt.key} align="center" colSpan={1} sx={{ fontWeight: 'bold' }}>
                                            {pt.label}
                                        </TableCell>
                                    ))}
                                    <TableCell rowSpan={2} align="center" sx={{ minWidth: 110, fontWeight: 'bold' }}>Marca Selecionada</TableCell>
                                    <TableCell rowSpan={2} align="center" sx={{ minWidth: 80, fontWeight: 'bold' }}>Valor/kg</TableCell>
                                    <TableCell rowSpan={2} align="center" sx={{ minWidth: 180, fontWeight: 'bold' }}>Orçamentos (Marca / R$/kg)</TableCell>
                                    <TableCell rowSpan={2} align="center" sx={{ fontWeight: 'bold' }}>Excluir</TableCell>
                                </TableRow>
                                <TableRow>
                                    {pizzaTypes.map(pt => (
                                        <TableCell key={pt.key} align="center" sx={{ fontWeight: 'bold' }}>Qtd</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ingredients.map((ing, i) => (
                                    <TableRow key={ing.id}>
                                        <TableCell>
                                            <TextField
                                                value={ing.name}
                                                variant="standard"
                                                onChange={e => setIngredients(ingredients.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))}
                                                sx={{ minWidth: 120 }}
                                        />
                                        </TableCell>
                                        <TableCell align="center">{ing.unit}</TableCell>
                                        {pizzaTypes.map(pt => (
                                            <TableCell key={pt.key} align="center">
                                                <TextField
                                                    value={ing.perPizza[pt.key] || ""}
                                                    type="number"
                                                    variant="standard"
                                                    InputProps={{ endAdornment: <span>{ing.unit}</span> }}
                                                    onChange={e => handlePerPizzaChange(ing.id, pt.key, e.target.value)}
                                                    sx={{ width: 60 }}
                                                />
                                            </TableCell>
                                        ))}
                                        <TableCell align="center">
                                            <Select
                                                value={ing.selectedBrand}
                                                onChange={e => handleBrandSelect(ing.id, e.target.value)}
                                                size="small"
                                                sx={{ width: 110 }}
                                            >
                                                {ing.quotes.map((q, idx) =>
                                                    q.brand ? <MenuItem key={idx} value={q.brand}>{q.brand}</MenuItem> : null
                                                )}
                                            </Select>
                                        </TableCell>
                                        <TableCell align="center">
                                            <TextField
                                                value={ing.quotes.find(q => q.brand === ing.selectedBrand)?.priceKG || ""}
                                                type="number"
                                                variant="standard"
                                                InputProps={{ startAdornment: <span>R$</span> }}
                                                onChange={e => {
                                                    const idx = ing.quotes.findIndex(q => q.brand === ing.selectedBrand);
                                                    handleQuoteChange(ing.id, idx, "priceKG", e.target.value);
                                                }}
                                                sx={{ width: 80 }}
                                        />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box>
                                                {ing.quotes.map((q, idx) => (
                                                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                        <TextField
                                                            value={q.brand}
                                                            label={`Marca ${idx + 1}`}
                                                            size="small"
                                                            variant="standard"
                                                            sx={{ width: 70, mr: 1 }}
                                                            onChange={e => handleQuoteChange(ing.id, idx, "brand", e.target.value)}
                                                        />
                                                        <TextField
                                                            value={q.priceKG}
                                                            type="number"
                                                            label="R$/kg"
                                                            size="small"
                                                            variant="standard"
                                                            sx={{ width: 60 }}
                                                            onChange={e => handleQuoteChange(ing.id, idx, "priceKG", e.target.value)}
                                                        />
                                                    </Box>
                                                ))}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton onClick={() => deleteIngredient(ing.id)} size="small" color="error">
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {/* nova linha de inclusão pode ser adaptada conforme necessário */}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
                {/* Custos extras */}
                <Paper sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h5" color="secondary" gutterBottom>
                        3. Custos Extras por Pizza
                    </Typography>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Item</TableCell>
                                    <TableCell align="right">R$ por pizza</TableCell>
                                    <TableCell align="right">Excluir</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {extraCosts.map(e => (
                                    <TableRow key={e.id}>
                                        <TableCell>
                                            <TextField value={e.name} variant="standard"
                                                onChange={ev => handleExtraChange(e.id, "name", ev.target.value)} />
                                        </TableCell>
                                        <TableCell align="right">
                                            <TextField value={e.value} type="number" variant="standard"
                                                onChange={ev => handleExtraChange(e.id, "value", Number(ev.target.value))}
                                                sx={{ width: 80 }} />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => deleteExtra(e.id)} size="small" color="error">
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell>
                                        <TextField label="Nome" size="small" variant="standard"
                                            value={newExtra.name}
                                            onChange={e => setNewExtra({ ...newExtra, name: e.target.value })} />
                                    </TableCell>
                                    <TableCell>
                                        <TextField label="Valor" size="small" type="number" variant="standard"
                                            value={newExtra.value}
                                            onChange={e => setNewExtra({ ...newExtra, value: e.target.value })} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={addExtra} size="small" color="primary"><Add /></IconButton>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
                {/* Equipamentos */}
                <Paper sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h5" color="secondary" gutterBottom>
                        4. Máquinas e Investimento Inicial
                    </Typography>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Equipamento</TableCell>
                                    <TableCell align="right">Valor total (R$)</TableCell>
                                    <TableCell align="right">Parcelas</TableCell>
                                    <TableCell align="right">Excluir</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {equipments.map(eq => (
                                    <TableRow key={eq.id}>
                                        <TableCell>
                                            <TextField value={eq.name} variant="standard"
                                                onChange={ev => handleEquipmentChange(eq.id, "name", ev.target.value)} />
                                        </TableCell>
                                        <TableCell align="right">
                                            <TextField value={eq.price} type="number" variant="standard"
                                                onChange={ev => handleEquipmentChange(eq.id, "price", Number(ev.target.value))}
                                                sx={{ width: 100 }} />
                                        </TableCell>
                                        <TableCell align="right">
                                            <TextField value={eq.installments} type="number" variant="standard"
                                                onChange={ev => handleEquipmentChange(eq.id, "installments", Number(ev.target.value))}
                                                sx={{ width: 60 }} />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => deleteEquipment(eq.id)} size="small" color="error">
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell>
                                        <TextField label="Descrição" size="small" variant="standard"
                                            value={newEquipment.name}
                                            onChange={e => setNewEquipment({ ...newEquipment, name: e.target.value })} />
                                    </TableCell>
                                    <TableCell>
                                        <TextField label="Valor" size="small" type="number" variant="standard"
                                            value={newEquipment.price}
                                            onChange={e => setNewEquipment({ ...newEquipment, price: e.target.value })} />
                                    </TableCell>
                                    <TableCell>
                                        <TextField label="Parcelas" size="small" type="number" variant="standard"
                                            value={newEquipment.installments}
                                            onChange={e => setNewEquipment({ ...newEquipment, installments: e.target.value })} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={addEquipment} size="small" color="primary"><Add /></IconButton>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Typography sx={{ mt: 2 }}><b>Investimento total estimado:</b> R$ {totalEquipment.toFixed(2)}</Typography>
                </Paper>
                {/* Custos Fixos */}
                <Paper sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h5" color="secondary" gutterBottom>
                        5. Custos Operacionais Fixos (mensais)
                    </Typography>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Descrição</TableCell>
                                    <TableCell align="right">Valor mensal (R$)</TableCell>
                                    <TableCell align="right">Excluir</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {fixedCosts.map(fc => (
                                    <TableRow key={fc.id}>
                                        <TableCell>
                                            <TextField value={fc.name} variant="standard"
                                                onChange={ev => handleFixedCostChange(fc.id, "name", ev.target.value)} />
                                        </TableCell>
                                        <TableCell align="right">
                                            <TextField value={fc.value} type="number" variant="standard"
                                                onChange={ev => handleFixedCostChange(fc.id, "value", Number(ev.target.value))}
                                                sx={{ width: 100 }} />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => deleteFixedCost(fc.id)} size="small" color="error">
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell>
                                        <TextField label="Nome" size="small" variant="standard"
                                            value={newFixedCost.name}
                                            onChange={e => setNewFixedCost({ ...newFixedCost, name: e.target.value })} />
                                    </TableCell>
                                    <TableCell>
                                        <TextField label="Valor" size="small" type="number" variant="standard"
                                            value={newFixedCost.value}
                                            onChange={e => setNewFixedCost({ ...newFixedCost, value: e.target.value })} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={addFixedCost} size="small" color="primary"><Add /></IconButton>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Typography sx={{ mt: 2 }}><b>Total custos fixos mês:</b> R$ {fixedCostMonth.toFixed(2)}</Typography>
                </Paper>
                <Divider sx={{ my: 3 }} />
                {/* Resumo */}
                <Box sx={{ p: 3, backgroundColor: "#f1f8e9", borderRadius: 2, boxShadow: 1 }}>
                    <Typography variant="h5" color="secondary" gutterBottom>
                        6. Simulação de Resultados
                    </Typography>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Pizza</TableCell>
                                    <TableCell align="right">Custo/pizza (R$)</TableCell>
                                    <TableCell align="right">Receita mês</TableCell>
                                    <TableCell align="right">Custo variável mês</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {results.map(r => (
                                    <TableRow key={r.key}>
                                        <TableCell>{r.label}</TableCell>
                                        <TableCell align="right">{r.totalCost.toFixed(2)}</TableCell>
                                        <TableCell align="right">{r.revenue.toFixed(2)}</TableCell>
                                        <TableCell align="right">{r.variable.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Typography sx={{ mt: 2 }}>
                        <b>Receita total:</b> R$ {totalRevenue.toFixed(2)}<br />
                        <b>Custo variável total:</b> R$ {totalVariable.toFixed(2)}<br />
                        <b>Custo fixo mensal:</b> R$ {fixedCostMonth.toFixed(2)}<br />
                        <b>Lucro líquido mensal:</b> <span style={{ color: grossProfit > 0 ? 'green' : 'red' }}>
                            R$ {grossProfit.toFixed(2)}
                        </span><br />
                        <b>Margem líquida (%):</b> {marginPercent} %<br />
                        <b>Payback estimado:</b> {payback} meses<br />
                    </Typography>
                    <Box mt={2}><i>Atualize valores, quantidades ou insira novos itens para simular diferentes cenários!</i></Box>
                </Box>
                {/* Rodapé */}
                <Box sx={{ mt: 6, textAlign: "center", color: "text.secondary" }}>
                    <Typography variant="caption">
                        Pizzaria Entre Amigos © {new Date().getFullYear()} | Simulador de Viabilidade React + MUI
                    </Typography>
                </Box>
            </Container>
        </MainContainer>
    )
};

export default Index;
