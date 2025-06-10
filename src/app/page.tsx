"use client"

import MainContainer from "@/components/containers/main-container";
import { Add, Delete } from "@mui/icons-material";
import { Avatar, Box, Container, Divider, Grid2, IconButton, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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
            { brand: "Anaconda", priceKG: 5.15 },
            { brand: "Venturelli", priceKG: 5 },
            { brand: "Caputo", priceKG: 20 },
        ],
        selectedBrand: "Anaconda",
    },
    { id: 2, name: "Fermento seco", unit: "g", perPizza: { marguerita: 4, calabresa: 4, toscana: 4, gorgonzola: 4 }, quotes: [{ brand: "Fleischmann", priceKG: 180 }, { brand: "", priceKG: 0 }, { brand: "", priceKG: 0 },], selectedBrand: "Fleischmann", },
    {
        id: 3,
        name: "Sal",
        unit: "g",
        perPizza: { marguerita: 3, calabresa: 3, toscana: 3, gorgonzola: 3 },
        quotes: [
            { brand: "Cisne", priceKG: 3 },
            { brand: "", priceKG: 0 },
            { brand: "", priceKG: 0 },
        ],
        selectedBrand: "Cisne",
    },
    {
        id: 4,
        name: "Azeite",
        unit: "ml",
        perPizza: { marguerita: 10, calabresa: 10, toscana: 10, gorgonzola: 10 },
        quotes: [
            { brand: "Andorinha", priceKG: 40 }, // preço por litro, ajuste se necessário
            { brand: "", priceKG: 0 },
            { brand: "", priceKG: 0 },
        ],
        selectedBrand: "Andorinha",
    },
    {
        id: 5,
        name: "Semolina",
        unit: "g",
        perPizza: { marguerita: 5, calabresa: 5, toscana: 5, gorgonzola: 5 },
        quotes: [
            { brand: "Venturelli", priceKG: 9 },
            { brand: "Caputo", priceKG: 0 },
            { brand: "", priceKG: 0 },
        ],
        selectedBrand: "Venturelli",
    },
    { id: 6, name: "Passata rústica de tomate", unit: "g", perPizza: { marguerita: 50, calabresa: 50, toscana: 50, gorgonzola: 50 }, quotes: [{ brand: "", priceKG: 0 }, { brand: "", priceKG: 0 }, { brand: "", priceKG: 0 },], selectedBrand: "", },
    { id: 7, name: "Queijo Mussarela", unit: "g", perPizza: { marguerita: 120, calabresa: 120, toscana: 120, gorgonzola: 120 }, quotes: [{ brand: "", priceKG: 0 }, { brand: "", priceKG: 0 }, { brand: "", priceKG: 0 },], selectedBrand: "", },
    { id: 8, name: "Queijo Gorgonzola", unit: "g", perPizza: { marguerita: 0, calabresa: 0, toscana: 0, gorgonzola: 60 }, quotes: [{ brand: "", priceKG: 0 }, { brand: "", priceKG: 0 }, { brand: "", priceKG: 0 },], selectedBrand: "", },
    { id: 9, name: "Linguiça Toscana", unit: "g", perPizza: { marguerita: 0, calabresa: 0, toscana: 60, gorgonzola: 0 }, quotes: [{ brand: "", priceKG: 0 }, { brand: "", priceKG: 0 }, { brand: "", priceKG: 0 },], selectedBrand: "", },
    { id: 10, name: "Tomate cereja", unit: "un", perPizza: { marguerita: 10, calabresa: 0, toscana: 0, gorgonzola: 0 }, quotes: [{ brand: "", priceKG: 0 }, { brand: "", priceKG: 0 }, { brand: "", priceKG: 0 },], selectedBrand: "", },
    { id: 11, name: "Manjericão", unit: "folha", perPizza: { marguerita: 10, calabresa: 0, toscana: 0, gorgonzola: 0 }, quotes: [{ brand: "", priceKG: 0 }, { brand: "", priceKG: 0 }, { brand: "", priceKG: 0 },], selectedBrand: "", },
];

type EquipmentQuote = {
    brand: string;
    price: number;
};
type Equipment = {
    id: number;
    name: string;
    quotes: EquipmentQuote[];
    selectedBrand: string;
};

// Atualize o estado inicial dos equipamentos
const initialEquipments: Equipment[] = [
    {
        id: 1,
        name: "Forno a gás p/ 1 pizza",
        quotes: [
            { brand: "Plus KiLocal, 35cm", price: 3468 },
            { brand: "Witt Etna Rotante, 40cm", price: 8499 },
            { brand: "EZ Oven 45 Duo", price: 2790 }
        ],
        selectedBrand: "Plus KiLocal, 35cm"
    },
    {
        id: 2,
        name: "Masseira espiral",
        quotes: [
            { brand: "Sebem 5kg", price: 6600 },
            { brand: "Braesi 5kg", price: 4490 },
            { brand: "Stand Mixer 7.6l", price: 5719.90 }
        ],
        selectedBrand: "Sebem 5kg"
    },
    {
        id: 4,
        name: "Utensílios & assadeiras",
        quotes: [
            { brand: "Diversos", price: 800 },
            { brand: "", price: 0 },
            { brand: "", price: 0 }
        ],
        selectedBrand: "Diversos"
    }
];

const Index = () => {

    // Sócios / Parceiros (exemplo inicial)
    const [partners] = useState([
        { id: 1, name: "André Mendonça", photo: "andre.jpg" },
        { id: 2, name: "Fred Coelho", photo: "fred.jpg" },
        { id: 2, name: "Hudson Teles", photo: "hudson.jpg" },
        { id: 2, name: "Uyrah Ramos", photo: "uyrah.jpg" }
    ]);

    // Funções utilitárias
    function loadFromStorage<T>(key: string, fallback: T): T {
        if (typeof window === "undefined") return fallback;
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : fallback;
        } catch {
            return fallback;
        }
    }
    function saveToStorage<T>(key: string, value: T) {
        if (typeof window === "undefined") return;
        localStorage.setItem(key, JSON.stringify(value));
    }

    const [ingredients, setIngredients] = useState<Ingredient[]>(
        () => loadFromStorage("ingredients", initialIngredients)
    );
    const [equipments, setEquipments] = useState<Equipment[]>(
        () => loadFromStorage("equipments", initialEquipments)
    );
    const [extraCosts, setExtraCosts] = useState(
        () => loadFromStorage("extraCosts", [
            { id: 1, name: "Embalagem a vácuo", value: 1.4 }
        ])
    );
    const [fixedCosts, setFixedCosts] = useState(
        () => loadFromStorage("fixedCosts", [
            { id: 1, name: "Botijão de gás P13 (mensal)", value: 240 },
            { id: 2, name: "Energia elétrica (mensal)", value: 90 }
        ])
    );
    const [pizzaParams, setPizzaParams] = useState(
        () => loadFromStorage("pizzaParams", {
            marguerita: { price: 35, month: 50 },
            calabresa: { price: 35, month: 50 },
            toscana: { price: 35, month: 50 },
            gorgonzola: { price: 35, month: 50 },
        })
    );
    const [doughComp, setDoughComp] = useState(
        () => loadFromStorage("doughComp", {
            farinha: 1000, fermento: 4, sal: 20, azeite: 30, agua: 600
        })
    );
    const [doughYield, setDoughYield] = useState(
        () => loadFromStorage("doughYield", 6)
    );
    const [equipmentInstallments, setEquipmentInstallments] = useState(
        () => loadFromStorage("equipmentInstallments", 10)
    );

    // Salve no storage sempre que mudar
    useEffect(() => { saveToStorage("ingredients", ingredients); }, [ingredients]);
    useEffect(() => { saveToStorage("equipments", equipments); }, [equipments]);
    useEffect(() => { saveToStorage("extraCosts", extraCosts); }, [extraCosts]);
    useEffect(() => { saveToStorage("fixedCosts", fixedCosts); }, [fixedCosts]);
    useEffect(() => { saveToStorage("pizzaParams", pizzaParams); }, [pizzaParams]);
    useEffect(() => { saveToStorage("doughComp", doughComp); }, [doughComp]);
    useEffect(() => { saveToStorage("doughYield", doughYield); }, [doughYield]);
    useEffect(() => { saveToStorage("equipmentInstallments", equipmentInstallments); }, [equipmentInstallments]);

    // IDs fixos para ingredientes da massa
    const MASSA_IDS = {
        farinha: 1,
        fermento: 2,
        sal: 3,
        azeite: 4,
    };

    // Atualiza ingredientes de massa conforme composição e rendimento
    useEffect(() => {
        setIngredients(prev => prev.map(ing => {
            if (ing.id === MASSA_IDS.farinha) {
                return { ...ing, perPizza: pizzaTypes.reduce((acc, pt) => ({ ...acc, [pt.key]: doughComp.farinha / doughYield }), {}) };
            }
            if (ing.id === MASSA_IDS.fermento) {
                return { ...ing, perPizza: pizzaTypes.reduce((acc, pt) => ({ ...acc, [pt.key]: doughComp.fermento / doughYield }), {}) };
            }
            if (ing.id === MASSA_IDS.sal) {
                return { ...ing, perPizza: pizzaTypes.reduce((acc, pt) => ({ ...acc, [pt.key]: doughComp.sal / doughYield }), {}) };
            }
            if (ing.id === MASSA_IDS.azeite) {
                return { ...ing, perPizza: pizzaTypes.reduce((acc, pt) => ({ ...acc, [pt.key]: doughComp.azeite / doughYield }), {}) };
            }
            return ing;
        }));
    }, [doughComp, doughYield, pizzaTypes]);

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
    // Calcule o investimento total e o valor da parcela
    const totalEquipment = equipments.reduce((sum, eq) => {
        const selected = eq.quotes.find(q => q.brand === eq.selectedBrand) || eq.quotes[0];
        return sum + (selected?.price || 0);
    }, 0);
    const payback = grossProfit > 0 ? (totalEquipment / grossProfit).toFixed(1) : "--";

    // --- Handlers CRUD ---

    // Estado para novo ingrediente
    const [newIngredient, setNewIngredient] = useState({
        name: "",
        unit: "g",
        perPizza: "",
        brand: "",
        priceKG: ""
    });

    // Ingredientes
    const addIngredient = () => {
        if (!newIngredient.name || !newIngredient.perPizza || !newIngredient.priceKG || !newIngredient.brand) return;
        setIngredients([
            ...ingredients,
            {
                id: Date.now(),
                name: newIngredient.name,
                unit: newIngredient.unit,
                perPizza: pizzaTypes.reduce((acc, pt) => ({ ...acc, [pt.key]: Number(newIngredient.perPizza) }), {}),
                quotes: [
                    { brand: newIngredient.brand, priceKG: Number(newIngredient.priceKG) },
                    { brand: "", priceKG: 0 },
                    { brand: "", priceKG: 0 }
                ],
                selectedBrand: newIngredient.brand,
            }
        ]);
        setNewIngredient({ name: "", unit: "g", perPizza: "", brand: "", priceKG: "" });
    };
    const deleteIngredient = (id) => setIngredients(ingredients.filter(x => x.id !== id));

    // Estado para novo custo extra
    const [newExtra, setNewExtra] = useState({ name: "", value: "" });

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

    const handleEquipmentQuoteChange = (eqId, quoteIdx, field, value) => {
        setEquipments(equipments.map(eq => {
            if (eq.id !== eqId) return eq;
            const quotes = eq.quotes.map((q, i) =>
                i === quoteIdx ? { ...q, [field]: value } : q
            );
            return { ...eq, quotes };
        }));
    };

    const handleEquipmentBrandSelect = (eqId, brand) => {
        setEquipments(equipments.map(eq =>
            eq.id === eqId ? { ...eq, selectedBrand: brand } : eq
        ));
    };
    // Estado para novo equipamento
    const [newEquipment, setNewEquipment] = useState({ name: "", price: "", brand: "" });

    const addEquipment = () => {
        if (!newEquipment.name || !newEquipment.price || !newEquipment.brand) return;
        setEquipments([
            ...equipments,
            {
                id: Date.now(),
                name: newEquipment.name,
                quotes: [
                    { brand: newEquipment.brand, price: Number(newEquipment.price) },
                    { brand: "", price: 0 },
                    { brand: "", price: 0 }
                ],
                selectedBrand: newEquipment.brand
            }
        ]);
        setNewEquipment({ name: "", price: "", brand: "" });
    };
    const deleteEquipment = id => setEquipments(equipments.filter(x => x.id !== id));

    // Custos Fixos
    const [newFixedCost, setNewFixedCost] = useState({ name: "", value: "" });
    const handleFixedCostChange = (id, field, value) =>
        setFixedCosts(fixedCosts.map(f => f.id === id ? { ...f, [field]: value } : f));
    const addFixedCost = () => {
        if (!newFixedCost.name || !newFixedCost.value) return;
        setFixedCosts([...fixedCosts, { id: Date.now(), ...newFixedCost, value: Number(newFixedCost.value) }]);
        setNewFixedCost({ name: "", value: "" });
    };
    const deleteFixedCost = id => setFixedCosts(fixedCosts.filter(x => x.id !== id));

    const equipmentInstallmentValue = equipmentInstallments > 0 ? totalEquipment / equipmentInstallments : totalEquipment;

    // KPIs extras
    const pizzasPorDia = (totalRevenue / pizzaTypes.reduce((acc, pt) => acc + pizzaParams[pt.key].price, 0) / 30).toFixed(1);
    const ticketMedio = (totalRevenue / pizzaTypes.reduce((acc, pt) => acc + pizzaParams[pt.key].month, 0)).toFixed(2);
    const pontoEquilibrio = fixedCostMonth > 0 ? (fixedCostMonth / (totalRevenue / pizzaTypes.reduce((acc, pt) => acc + pizzaParams[pt.key].month, 0))).toFixed(1) : "--";

    // Dados para gráficos
    const receitaCustoData = results.map(r => ({
        name: r.label,
        Receita: r.revenue,
        "Custo Variável": r.variable,
        "Custo Fixo": fixedCostMonth / pizzaTypes.length,
        Lucro: r.revenue - r.variable - fixedCostMonth / pizzaTypes.length
    }));

    const vendasData = pizzaTypes.map(pt => ({
        name: pt.label,
        Vendas: pizzaParams[pt.key].month
    }));

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    return (

        <MainContainer>
            <Container maxWidth="xl" sx={{ pb: 8 }}>
                <Box sx={{ my: 4 }}>
                    <Typography variant="h3" color="primary" align="center">
                        Planejamento Estratégico
                    </Typography>
                    <Typography variant="h4" color="primary" align="center">
                        Nostra Pizza
                    </Typography>
                    <Typography variant="h5" align="center" color="text.secondary" gutterBottom>
                        Simulador de Viabilidade
                    </Typography>
                </Box>
                {/* Sócios / Parceiros */}
                <Paper sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h5" color="secondary" textAlign="center" mb={5}>
                        🍕🍕🍕 Os Parceiros 🚀🚀🚀
                    </Typography>
                    <Grid2 container spacing={2} sx={{ mb: 2 }}>
                        {partners.map((p) => (
                            <Grid2 key={p.id} size={{ xs: 12, sm: 6, md: 3}}>
                                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <Avatar
                                        src={`partners/${p.photo}`}
                                        sx={{ width: 80, height: 80, mb: 1, bgcolor: "#eee", fontSize: 32 }}
                                    >
                                        {!p.photo && p.name ? p.name[0].toUpperCase() : ""}
                                    </Avatar>
                                    <Typography variant="subtitle2" align="center">{p.name}</Typography>
                                </Box>
                            </Grid2>
                        ))}
                    </Grid2>
                </Paper>
                {/* 1. Parâmetros de Venda por Pizza */}
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
                {/* 2. Composição da Massa */}
                <Paper sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h5" color="secondary" gutterBottom>
                        2. Composição da Massa
                    </Typography>
                    <Grid2 container spacing={2}>
                        <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                            <TextField
                                label="Farinha (g)"
                                type="number"
                                value={doughComp.farinha}
                                onChange={e => setDoughComp({ ...doughComp, farinha: Number(e.target.value) })}
                                fullWidth
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                            <TextField
                                label="Fermento (g)"
                                type="number"
                                value={doughComp.fermento}
                                onChange={e => setDoughComp({ ...doughComp, fermento: Number(e.target.value) })}
                                fullWidth
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                            <TextField
                                label="Sal (g)"
                                type="number"
                                value={doughComp.sal}
                                onChange={e => setDoughComp({ ...doughComp, sal: Number(e.target.value) })}
                                fullWidth
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                            <TextField
                                label="Azeite (ml)"
                                type="number"
                                value={doughComp.azeite}
                                onChange={e => setDoughComp({ ...doughComp, azeite: Number(e.target.value) })}
                                fullWidth
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                            <TextField
                                label="Água (ml)"
                                type="number"
                                value={doughComp.agua}
                                onChange={e => setDoughComp({ ...doughComp, agua: Number(e.target.value) })}
                                fullWidth
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                            <TextField
                                label="Rendimento (pizzas)"
                                type="number"
                                value={doughYield}
                                onChange={e => setDoughYield(Number(e.target.value))}
                                fullWidth
                            />
                        </Grid2>
                    </Grid2>
                </Paper>
                {/* 3. Ingredientes por Pizza */}
                <Paper sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h5" color="secondary" gutterBottom>
                        3. Ingredientes por Pizza (até 3 orçamentos por item)
                    </Typography>
                    <Grid2 container spacing={2}>
                        {/* Cards fixos para farinha, fermento, sal, azeite - sempre nos primeiros itens */}
                        {Object.values(MASSA_IDS).map(id => {
                            const ing = ingredients.find(ing => ing.id === id);
                            if (!ing) return null;
                            return (
                                <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={ing.id}>
                                    <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', gap: 1, opacity: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                            <TextField
                                                value={ing.name}
                                                variant="standard"
                                                label="Ingrediente"
                                                disabled
                                                sx={{ flex: 1, mb: 1 }}
                                                fullWidth
                                            />
                                        </Box>
                                        <Grid2 container spacing={1}>
                                            {pizzaTypes.map((pt, idx) => (
                                                <Grid2 size={{ xs: 6 }} key={pt.key}>
                                                    <TextField
                                                        label={pt.label}
                                                        value={Number(ing.perPizza[pt.key] || 0).toFixed(2)}
                                                        type="number"
                                                        variant="standard"
                                                        InputProps={{ endAdornment: <span>{ing.unit}</span> }}
                                                        disabled
                                                        sx={{ width: '100%' }}
                                                        size="small"
                                                    />
                                                </Grid2>
                                            ))}
                                        </Grid2>
                                        <Divider sx={{ my: 1 }} />
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1 }}>
                                            <Typography variant="caption" sx={{ mb: 0.5 }}>
                                                Marca Selecionada
                                            </Typography>
                                            <Select
                                                value={ing.selectedBrand}
                                                onChange={e => handleBrandSelect(ing.id, e.target.value)}
                                                size="small"
                                                sx={{
                                                    width: '100%',
                                                    bgcolor: ing.selectedBrand ? 'primary.light' : '#fffbe6',
                                                    fontWeight: 'bold',
                                                    border: '2px solid',
                                                    borderColor: ing.selectedBrand ? 'primary.main' : 'orange',
                                                    color: ing.selectedBrand ? 'white' : 'orange'
                                                }}
                                                displayEmpty
                                                error={!ing.selectedBrand}
                                            >
                                                <MenuItem value="">
                                                    <em style={{ color: 'orange' }}>Selecione uma marca</em>
                                                </MenuItem>
                                                {ing.quotes.map((q, idx) =>
                                                    q.brand ? <MenuItem key={idx} value={q.brand}>{q.brand}</MenuItem> : null
                                                )}
                                            </Select>
                                            {!ing.selectedBrand && (
                                                <Typography variant="caption" color="orange" sx={{ mt: 0.5 }}>
                                                    Selecione uma marca!
                                                </Typography>
                                            )}
                                        </Box>
                                        <Box sx={{ width: '100%' }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                                                Orçamentos / Mercados
                                            </Typography>
                                            {ing.quotes.map((q, idx) => (
                                                <Box key={idx} sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    mb: 1,
                                                    p: 1,
                                                    borderRadius: 1,
                                                    bgcolor: q.brand === ing.selectedBrand ? 'primary.lighter' : 'transparent',
                                                    border: q.brand === ing.selectedBrand ? '1.5px solid' : '1px dashed #eee',
                                                    borderColor: q.brand === ing.selectedBrand ? 'primary.main' : '#eee'
                                                }}>
                                                    <Typography variant="body2" sx={{ minWidth: 22, fontWeight: 600 }}>{idx + 1}.</Typography>
                                                    <TextField
                                                        value={q.brand}
                                                        label="Marca/Mercado"
                                                        size="small"
                                                        variant="standard"
                                                        sx={{ flex: 1 }}
                                                        fullWidth
                                                        onChange={e => handleQuoteChange(ing.id, idx, "brand", e.target.value)}
                                                    />
                                                    <TextField
                                                        value={q.priceKG}
                                                        type="number"
                                                        label="Valor (R$/kg)"
                                                        size="small"
                                                        variant="standard"
                                                        sx={{ flex: 1, ml: 1 }}
                                                        fullWidth
                                                        onChange={e => handleQuoteChange(ing.id, idx, "priceKG", e.target.value)}
                                                        InputProps={{ startAdornment: <span>R$</span> }}
                                                    />
                                                </Box>
                                            ))}
                                        </Box>
                                    </Paper>
                                </Grid2>
                            );
                        })}
                        {/* Demais ingredientes (excluíveis normalmente) */}
                        {ingredients.filter(ing =>
                            ![MASSA_IDS.farinha, MASSA_IDS.fermento, MASSA_IDS.sal, MASSA_IDS.azeite].includes(ing.id)
                        ).map((ing, i) => (
                            <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={ing.id}>
                                <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {/* Nome do ingrediente ocupa linha toda */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                        <TextField
                                            value={ing.name}
                                            variant="standard"
                                            label="Ingrediente"
                                            onChange={e => setIngredients(ingredients.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))}
                                            sx={{ flex: 1, mb: 1 }}
                                            fullWidth
                                        />
                                        <IconButton onClick={() => deleteIngredient(ing.id)} size="small" color="error">
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                    {/* Pizzas em 2 por linha */}
                                    <Grid2 container spacing={1}>
                                        {pizzaTypes.map((pt, idx) => (
                                            <Grid2 size={{ xs: 6 }} key={pt.key}>
                                                <TextField
                                                    label={pt.label}
                                                    value={ing.perPizza[pt.key] || ""}
                                                    type="number"
                                                    variant="standard"
                                                    InputProps={{ endAdornment: <span>{ing.unit}</span> }}
                                                    onChange={e => handlePerPizzaChange(ing.id, pt.key, e.target.value)}
                                                    sx={{ width: '100%' }}
                                                    size="small"
                                                />
                                            </Grid2>
                                        ))}
                                    </Grid2>
                                    <Divider sx={{ my: 1 }} />
                                    {/* Marca selecionada em destaque, ocupa linha toda */}
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1 }}>
                                        <Typography variant="caption" sx={{ mb: 0.5 }}>
                                            Marca Selecionada
                                        </Typography>
                                        <Select
                                            value={ing.selectedBrand}
                                            onChange={e => handleBrandSelect(ing.id, e.target.value)}
                                            size="small"
                                            sx={{
                                                width: '100%',
                                                bgcolor: ing.selectedBrand ? 'primary.light' : '#fffbe6',
                                                fontWeight: 'bold',
                                                border: '2px solid',
                                                borderColor: ing.selectedBrand ? 'primary.main' : 'orange',
                                                color: ing.selectedBrand ? 'white' : 'orange'
                                            }}
                                            displayEmpty
                                            error={!ing.selectedBrand}
                                        >
                                            <MenuItem value="">
                                                <em style={{ color: 'orange' }}>Selecione uma marca</em>
                                            </MenuItem>
                                            {ing.quotes.map((q, idx) =>
                                                q.brand ? <MenuItem key={idx} value={q.brand}>{q.brand}</MenuItem> : null
                                            )}
                                        </Select>
                                        {!ing.selectedBrand && (
                                            <Typography variant="caption" color="orange" sx={{ mt: 0.5 }}>
                                                Selecione uma marca!
                                            </Typography>
                                        )}
                                    </Box>
                                    {/* Orçamentos ocupam linha toda, numerados */}
                                    <Box sx={{ width: '100%' }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                                            Orçamentos / Mercados
                                        </Typography>
                                        {ing.quotes.map((q, idx) => (
                                            <Box key={idx} sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                gap: 1,
                                                mb: 1,
                                                p: 1,
                                                borderRadius: 1,
                                                bgcolor: q.brand === ing.selectedBrand ? 'primary.lighter' : 'transparent',
                                                border: q.brand === ing.selectedBrand ? '1.5px solid' : '1px dashed #eee',
                                                borderColor: q.brand === ing.selectedBrand ? 'primary.main' : '#eee'
                                            }}>
                                                <Typography variant="body2" sx={{ minWidth: 22, fontWeight: 600 }}>{idx + 1}.</Typography>
                                                <TextField
                                                    value={q.brand}
                                                    label="Marca/Mercado"
                                                    size="small"
                                                    variant="standard"
                                                    sx={{ flex: 1 }}
                                                    fullWidth
                                                    onChange={e => handleQuoteChange(ing.id, idx, "brand", e.target.value)}
                                                />
                                                <TextField
                                                    value={q.priceKG}
                                                    type="number"
                                                    label="Valor (R$/kg)"
                                                    size="small"
                                                    variant="standard"
                                                    sx={{ flex: 1, ml: 1 }}
                                                    fullWidth
                                                    onChange={e => handleQuoteChange(ing.id, idx, "priceKG", e.target.value)}
                                                    InputProps={{ startAdornment: <span>R$</span> }}
                                                />
                                            </Box>
                                        ))}
                                    </Box>
                                </Paper>
                            </Grid2>
                        ))}
                        {/* Card para adicionar novo ingrediente */}
                        <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                            <Paper elevation={1} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <TextField
                                    label="Ingrediente"
                                    size="small"
                                    variant="standard"
                                    value={newIngredient.name}
                                    onChange={e => setNewIngredient({ ...newIngredient, name: e.target.value })}
                                    sx={{ mb: 1 }}
                                />
                                <TextField
                                    label="Unidade"
                                    size="small"
                                    variant="standard"
                                    value={newIngredient.unit}
                                    onChange={e => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                                    sx={{ mb: 1 }}
                                />
                                <TextField
                                    label="Qtd por pizza"
                                    size="small"
                                    variant="standard"
                                    value={newIngredient.perPizza}
                                    onChange={e => setNewIngredient({ ...newIngredient, perPizza: e.target.value })}
                                    sx={{ mb: 1 }}
                                />
                                <TextField
                                    label="Marca/Mercado"
                                    size="small"
                                    variant="standard"
                                    value={newIngredient.brand}
                                    onChange={e => setNewIngredient({ ...newIngredient, brand: e.target.value })}
                                    sx={{ mb: 1 }}
                                />
                                <TextField
                                    label="Valor/kg"
                                    size="small"
                                    variant="standard"
                                    value={newIngredient.priceKG}
                                    onChange={e => setNewIngredient({ ...newIngredient, priceKG: e.target.value })}
                                    sx={{ mb: 1 }}
                                />
                                <IconButton onClick={addIngredient} size="small" color="primary"><Add /></IconButton>
                            </Paper>
                        </Grid2>
                    </Grid2>
                </Paper>
                {/* Custos extras */}
                <Paper sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h5" color="secondary" gutterBottom>
                        4. Custos Extras por Pizza
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
                                            <TextField value={e.name} variant="standard" fullWidth
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
                                            fullWidth
                                            value={newExtra.name}
                                            onChange={e => setNewExtra({ ...newExtra, name: e.target.value })}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField label="Valor" size="small" type="number" variant="standard"
                                            fullWidth
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
                        7. Máquinas e Investimento Inicial (até 3 orçamentos por item)
                    </Typography>
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TextField
                            label="Parcelas do investimento"
                            type="number"
                            size="small"
                            value={equipmentInstallments}
                            onChange={e => setEquipmentInstallments(Math.max(1, Number(e.target.value)))}
                            sx={{ width: 180 }}
                            inputProps={{ min: 1 }}
                        />
                        <Typography>
                            Valor da parcela: <b>R$ {equipmentInstallmentValue.toFixed(2)}</b>
                        </Typography>
                    </Box>
                    <Grid2 container spacing={2}>
                        {equipments.map((eq, i) => (
                            <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={eq.id}>
                                <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {/* Nome do equipamento */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                        <TextField
                                            value={eq.name}
                                            variant="standard"
                                            label="Equipamento"
                                            onChange={e => setEquipments(equipments.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))}
                                            sx={{ flex: 1, mb: 1 }}
                                            fullWidth
                                        />
                                        <IconButton onClick={() => deleteEquipment(eq.id)} size="small" color="error">
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                    {/* Marca selecionada em destaque */}
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1 }}>
                                        <Typography variant="caption" sx={{ mb: 0.5 }}>
                                            Marca Selecionada
                                        </Typography>
                                        <Select
                                            value={eq.selectedBrand}
                                            onChange={e => handleEquipmentBrandSelect(eq.id, e.target.value)}
                                            size="small"
                                            sx={{
                                                width: '100%',
                                                bgcolor: eq.selectedBrand ? 'primary.light' : '#fffbe6',
                                                fontWeight: 'bold',
                                                border: '2px solid',
                                                borderColor: eq.selectedBrand ? 'primary.main' : 'orange',
                                                color: eq.selectedBrand ? 'white' : 'orange'
                                            }}
                                            displayEmpty
                                            error={!eq.selectedBrand}
                                        >
                                            <MenuItem value="">
                                                <em style={{ color: 'orange' }}>Selecione uma marca</em>
                                            </MenuItem>
                                            {eq.quotes.map((q, idx) =>
                                                q.brand ? <MenuItem key={idx} value={q.brand}>{q.brand}</MenuItem> : null
                                            )}
                                        </Select>
                                        {!eq.selectedBrand && (
                                            <Typography variant="caption" color="orange" sx={{ mt: 0.5 }}>
                                                Selecione uma marca!
                                            </Typography>
                                        )}
                                    </Box>
                                    {/* Orçamentos ocupam linha toda, numerados */}
                                    <Box sx={{ width: '100%' }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                                            Orçamentos / Fornecedores
                                        </Typography>
                                        {eq.quotes.map((q, idx) => (
                                            <Box key={idx} sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                gap: 1,
                                                mb: 1,
                                                p: 1,
                                                borderRadius: 1,
                                                bgcolor: q.brand === eq.selectedBrand ? 'primary.lighter' : 'transparent',
                                                border: q.brand === eq.selectedBrand ? '1.5px solid' : '1px dashed #eee',
                                                borderColor: q.brand === eq.selectedBrand ? 'primary.main' : '#eee'
                                            }}>
                                                <Typography variant="body2" sx={{ minWidth: 22, fontWeight: 600 }}>{idx + 1}.</Typography>
                                                <TextField
                                                    value={q.brand}
                                                    label="Marca/Fornecedor"
                                                    size="small"
                                                    variant="standard"
                                                    sx={{ flex: 1 }}
                                                    fullWidth
                                                    onChange={e => handleEquipmentQuoteChange(eq.id, idx, "brand", e.target.value)}
                                                />
                                                <TextField
                                                    value={q.price}
                                                    type="number"
                                                    label="Valor (R$)"
                                                    size="small"
                                                    variant="standard"
                                                    sx={{ flex: 1, ml: 1 }}
                                                    fullWidth
                                                    onChange={e => handleEquipmentQuoteChange(eq.id, idx, "price", e.target.value)}
                                                    InputProps={{ startAdornment: <span>R$</span> }}
                                                />
                                            </Box>
                                        ))}
                                    </Box>
                                </Paper>
                            </Grid2>
                        ))}
                        {/* Card para adicionar novo equipamento */}
                        <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                            <Paper elevation={1} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <TextField
                                    label="Equipamento"
                                    size="small"
                                    variant="standard"
                                    value={newEquipment.name}
                                    onChange={e => setNewEquipment({ ...newEquipment, name: e.target.value })}
                                    sx={{ mb: 1 }}
                                />
                                <TextField
                                    label="Marca/Fornecedor"
                                    size="small"
                                    variant="standard"
                                    value={newEquipment.brand}
                                    onChange={e => setNewEquipment({ ...newEquipment, brand: e.target.value })}
                                    sx={{ mb: 1 }}
                                />
                                <TextField
                                    label="Valor"
                                    size="small"
                                    variant="standard"
                                    value={newEquipment.price}
                                    onChange={e => setNewEquipment({ ...newEquipment, price: e.target.value })}
                                    sx={{ mb: 1 }}
                                />
                                <IconButton onClick={addEquipment} size="small" color="primary"><Add /></IconButton>
                            </Paper>
                        </Grid2>
                    </Grid2>
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
                                            <TextField value={fc.name} variant="standard" fullWidth
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
                <Box sx={{ p: 3, backgroundColor: "#f1f8e9", borderRadius: 2, boxShadow: 1, mb: 4 }}>
                    <Typography variant="h5" color="secondary" gutterBottom>
                        6. Simulação de Resultados
                    </Typography>
                    {/* Indicadores rápidos */}
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 3 }}>
                        <Box>
                            <Typography variant="subtitle2">Lucro Líquido Mensal</Typography>
                            <Typography variant="h6" color={grossProfit > 0 ? "green" : "red"}>R$ {grossProfit.toFixed(2)}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2">Margem Líquida</Typography>
                            <Typography variant="h6">{marginPercent} %</Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2">Payback</Typography>
                            <Typography variant="h6">{payback} meses</Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2">Ticket Médio</Typography>
                            <Typography variant="h6">R$ {ticketMedio}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2">Pizzas/dia</Typography>
                            <Typography variant="h6">{pizzasPorDia}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2">Ponto de Equilíbrio</Typography>
                            <Typography variant="h6">{pontoEquilibrio} pizzas/mês</Typography>
                        </Box>
                    </Box>
                    {/* Gráfico Receita x Custos x Lucro */}
                    <Typography variant="subtitle2" sx={{ mt: 2 }}>Receita, Custos e Lucro por Pizza</Typography>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={receitaCustoData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Receita" fill="#0088FE" />
                            <Bar dataKey="Custo Variável" fill="#FFBB28" />
                            <Bar dataKey="Custo Fixo" fill="#FF8042" />
                            <Bar dataKey="Lucro" fill="#00C49F" />
                        </BarChart>
                    </ResponsiveContainer>
                    {/* Gráfico de vendas por sabor */}
                    <Typography variant="subtitle2" sx={{ mt: 4 }}>Distribuição de Vendas por Sabor</Typography>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie data={vendasData} dataKey="Vendas" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                                {vendasData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Tabela detalhada já existente */}
                    <TableContainer sx={{ mt: 4 }}>
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
