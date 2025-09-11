import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid"; // v7 Grid (uses `size` prop)
import {
    Box,
    Stack,
    Typography,
    Button,
    Paper, Chip
} from "@mui/material";
import MicOutlined from "@mui/icons-material/MicOutlined";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";

import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

import { alpha } from "@mui/material/styles";
import MicOutlinedIcon from "@mui/icons-material/MicOutlined";
import AccessibilityNewOutlinedIcon from "@mui/icons-material/AccessibilityNewOutlined";
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import HeadsetOutlinedIcon from "@mui/icons-material/HeadsetOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";

import {
    List, ListItem, ListItemIcon, ListItemText
} from "@mui/material";
import Diversity3OutlinedIcon from "@mui/icons-material/Diversity3Outlined";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

// replace with your image
import coverageImg from "../assets/cities.jpg";


// replace with your image
import accessImg from "../assets/accessibility.jpg";


// Replace with your image
import hero from "../assets/assistant.jpg";
import aboutImg from "../assets/delivery.jpg";

export default function Home() {
    return (
        <>
            {/* HERO */}
            <Box sx={{ bgcolor: "background.default" }}>
                <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
                    <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
                        {/* Left copy */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Stack spacing={{ xs: 2, md: 3 }}>
                                {/* Badge */}
                                <Box
                                    sx={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 1,
                                        px: 1.25,
                                        py: 0.75,
                                        borderRadius: 999,
                                        bgcolor: "grey.100",
                                        border: 1,
                                        borderColor: "grey.200",
                                        width: "auto",
                                    }}
                                >
                                    <MicOutlined fontSize="small" />
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        Voice-First AI Technology
                                    </Typography>
                                </Box>

                                {/* Headline */}
                                <Typography
                                    sx={{
                                        fontWeight: 900,
                                        letterSpacing: -0.5,
                                        lineHeight: 1.1,
                                        fontSize: { xs: "2.2rem", sm: "3.2rem", md: "4rem" },
                                    }}
                                >
                                    Meet Porter Saathi
                                    <br />
                                    Your AI Voice Partner
                                </Typography>

                                {/* Subcopy */}
                                <Typography color="text.secondary" sx={{ maxWidth: 680 }}>
                                    Empowering logistics with voice-first AI technology. Making
                                    delivery services accessible and easy for everyone across
                                    India&apos;s growing cities.
                                </Typography>

                                {/* CTAs */}
                                <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        href="/assistant"
                                        startIcon={<PlayArrowRounded />}
                                        sx={{ borderRadius: 2, px: 2.5 }}
                                    >
                                        Try Voice Commands
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        href="/#about-porter"
                                        endIcon={<ArrowForwardRounded />}
                                        sx={{ borderRadius: 2, px: 2.5 }}
                                    >
                                        Learn More
                                    </Button>
                                </Stack>

                                {/* Divider line (only under left column like the mock) */}
                                <Box
                                    sx={{
                                        borderBottom: 1,
                                        borderColor: "divider",
                                        mt: { xs: 2, md: 4 },
                                    }}
                                />

                                {/* Stats */}
                                <Grid container spacing={2} sx={{ pt: 1 }}>
                                    {[
                                        { k: "22+", v: "Cities Covered" },
                                        { k: "24/7", v: "Voice Support" },
                                        { k: "100%", v: "Accessible" },
                                    ].map((s) => (
                                        <Grid key={s.v} size={{ xs: 12, sm: 4 }}>
                                            <Stack spacing={0.5}>
                                                <Typography
                                                    sx={{ fontWeight: 800, fontSize: "1.6rem" }}
                                                >
                                                    {s.k}
                                                </Typography>
                                                <Typography color="text.secondary">{s.v}</Typography>
                                            </Stack>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Stack>
                        </Grid>

                        {/* Right image */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box
                                sx={{
                                    position: "relative",
                                    maxWidth: 720,
                                    ml: { md: "auto" },
                                }}
                            >
                                {/* decorative side-tabs */}
                                <Box
                                    sx={{
                                        position: "absolute",
                                        left: -10,
                                        top: "45%",
                                        width: 26,
                                        height: 64,
                                        bgcolor: "common.white",
                                        borderRadius: 2,
                                        boxShadow: 1,
                                        opacity: 0.9,
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: "absolute",
                                        right: -10,
                                        top: "55%",
                                        width: 26,
                                        height: 64,
                                        bgcolor: "common.white",
                                        borderRadius: 2,
                                        boxShadow: 1,
                                        opacity: 0.9,
                                    }}
                                />

                                {/* image card */}
                                <Paper
                                    elevation={8}
                                    sx={{
                                        overflow: "hidden",
                                        borderRadius: 4,
                                        boxShadow:
                                            "0 20px 60px rgba(3,70,219,0.18), 0 8px 20px rgba(0,0,0,0.06)",
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={hero}
                                        alt="Microphone showing voice-first tech"
                                        sx={{
                                            display: "block",
                                            width: "100%",
                                            height: { xs: 280, sm: 360, md: 420 },
                                            objectFit: "cover",
                                        }}
                                    />
                                </Paper>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* ABOUT (anchor for Learn More) */}
            {/* ABOUT PORTER */}
            <Box sx={{ bgcolor: "grey.50" }}>
                <Container
                    id="about-porter"
                    maxWidth="xl"
                    sx={{ py: { xs: 8, md: 10 }, scrollMarginTop: "96px" }}
                >
                    <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
                        {/* Left: Image */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box
                                component="img"
                                src={aboutImg}
                                alt="Reliable Indian logistics"
                                sx={{
                                    width: "100%",
                                    height: { xs: 320, md: 560 },
                                    objectFit: "cover",
                                    borderRadius: 3,
                                    boxShadow: "0 24px 80px rgba(3,70,219,0.12), 0 10px 24px rgba(0,0,0,0.08)",
                                }}
                            />
                        </Grid>

                        {/* Right: Copy + Feature cards */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Stack spacing={{ xs: 3, md: 4 }}>
                                <Typography
                                    variant="h3"
                                    sx={{ fontWeight: 900, letterSpacing: -0.5, lineHeight: 1.15 }}
                                >
                                    Leading Logistics Service Provider
                                </Typography>

                                <Typography color="text.secondary">
                                    Porter is transforming India&apos;s logistics landscape with reliable
                                    transportation solutions. From small packages to large cargo, we make
                                    deliveries easy across 22 major Indian cities.
                                </Typography>

                                <Grid container spacing={3}>
                                    {[
                                        {
                                            icon: <LocalShippingOutlinedIcon />,
                                            title: "Reliable Transportation",
                                            desc: "Wide range of transportation solutions for all your delivery needs",
                                        },
                                        {
                                            icon: <PlaceOutlinedIcon />,
                                            title: "22 Cities Coverage",
                                            desc: "Operating across major Indian cities including Mumbai, Delhi, Bangalore, and more",
                                        },
                                        {
                                            icon: <AccessTimeOutlinedIcon />,
                                            title: "Quick Deliveries",
                                            desc: "Fast and efficient delivery services that you can rely on",
                                        },
                                        {
                                            icon: <ShieldOutlinedIcon />,
                                            title: "Trusted Service",
                                            desc: "Leading logistics provider with proven track record",
                                        },
                                    ].map((c) => (
                                        <Grid key={c.title} size={{ xs: 12, md: 6 }}>
                                            <Paper
                                                variant="outlined"
                                                sx={{
                                                    p: 3,
                                                    borderRadius: 3,
                                                    height: "100%",
                                                    display: "flex",
                                                    gap: 2,
                                                    alignItems: "flex-start",
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        p: 1,
                                                        borderRadius: 2,
                                                        bgcolor: "grey.100",
                                                        color: "text.secondary",
                                                        display: "grid",
                                                        placeItems: "center",
                                                    }}
                                                >
                                                    {c.icon}
                                                </Box>
                                                <Box>
                                                    <Typography fontWeight={800}>{c.title}</Typography>
                                                    <Typography color="text.secondary" mt={0.5}>
                                                        {c.desc}
                                                    </Typography>
                                                </Box>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
            </Box>


            {/* AI FEATURES */}
            <Container
                id="ai-features"
                maxWidth="xl"
                sx={{ py: { xs: 10, md: 12 }, scrollMarginTop: "96px" }} // more vertical space
            >
                <Stack alignItems="center" spacing={2.25} sx={{ mb: 3 }}>
                    <Chip
                        icon={<MicOutlinedIcon sx={{ fontSize: 18 }} />}
                        label="AI Features"
                        size="small"
                        sx={{
                            fontWeight: 700,
                            bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
                            color: "text.primary",
                            "& .MuiChip-icon": { color: "text.primary" },
                        }}
                    />
                    <Typography
                        variant="h3"
                        align="center"
                        sx={{ fontWeight: 900, letterSpacing: -0.5, lineHeight: 1.15 }}
                    >
                        Empowering Through Voice Technology
                    </Typography>
                    <Typography align="center" color="text.secondary" sx={{ maxWidth: 960 }}>
                        Porter Saathi breaks down barriers with intuitive voice-first AI, making logistics
                        accessible to everyone regardless of technical expertise or physical abilities.
                    </Typography>
                </Stack>

                {/* roomier grid */}
                <Grid container spacing={{ xs: 3.5, md: 4.5 }} sx={{ mt: 2 }}>
                    {[
                        {
                            icon: <MicOutlinedIcon sx={{ fontSize: 24 }} />,
                            iconBg: (t: any) => alpha(t.palette.primary.main, 0.12),
                            title: "Voice Commands",
                            desc: "Book deliveries, track packages, and get updates using simple voice commands",
                        },
                        {
                            icon: <AccessibilityNewOutlinedIcon sx={{ fontSize: 24 }} />,
                            iconBg: (t: any) => alpha(t.palette.success.main, 0.14),
                            title: "Universal Accessibility",
                            desc: "Designed for users with visual impairments and those who prefer hands-free interaction",
                        },
                        {
                            icon: <TranslateOutlinedIcon sx={{ fontSize: 24 }} />,
                            iconBg: (t: any) => alpha(t.palette.secondary.main, 0.14),
                            title: "Multi-Language Support",
                            desc: "Communicate in Hindi, English, and regional languages for better accessibility",
                        },
                        {
                            icon: <SmartphoneOutlinedIcon sx={{ fontSize: 24 }} />,
                            iconBg: (t: any) => alpha(t.palette.warning.main, 0.16),
                            title: "Mobile Integration",
                            desc: "Seamlessly works with your smartphone for a complete logistics experience",
                        },
                        {
                            icon: <HeadsetOutlinedIcon sx={{ fontSize: 24 }} />,
                            iconBg: (t: any) => alpha(t.palette.error.main, 0.14),
                            title: "Audio Feedback",
                            desc: "Clear audio responses and confirmations for every action and update",
                        },
                        {
                            icon: <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 24 }} />,
                            iconBg: (t: any) => alpha(t.palette.info.main, 0.16),
                            title: "Natural Conversations",
                            desc: "Talk to Porter Saathi like you would with a human assistant",
                        },
                    ].map((f) => (
                        <Grid key={f.title} size={{ xs: 12, md: 4 }}>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: { xs: 3, sm: 4 },               // ✅ more inner padding
                                    borderRadius: 4,                   // rounder corners
                                    borderColor: "grey.200",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: { xs: 2, sm: 2.5 },          // ✅ bigger gap between icon/text
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 56,                       // ✅ larger icon tile
                                        height: 56,
                                        borderRadius: 2,
                                        display: "grid",
                                        placeItems: "center",
                                        bgcolor: f.iconBg,
                                        color: "text.primary",
                                        flexShrink: 0,
                                    }}
                                >
                                    {f.icon}
                                </Box>
                                <Box>
                                    <Typography fontWeight={800} sx={{ mb: 0.5 }}>
                                        {f.title}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        {f.desc}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
            {/* EMPOWERMENT / ACCESSIBILITY */}
            <Container maxWidth="xl" sx={{ py: { xs: 8, md: 10 } }}>
                <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
                    {/* Left: copy */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Stack spacing={{ xs: 2.5, md: 3 }}>
                            {/* badge */}
                            <Chip
                                icon={<Diversity3OutlinedIcon sx={{ fontSize: 18 }} />}
                                label="Empowerment in Action"
                                size="small"
                                sx={{
                                    alignSelf: "flex-start",
                                    fontWeight: 700,
                                    bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
                                    color: "text.primary",
                                    "& .MuiChip-icon": { color: "text.primary" },
                                }}
                            />

                            {/* heading */}
                            <Typography
                                sx={{ fontWeight: 900, letterSpacing: -0.5, lineHeight: 1.15, fontSize: { xs: "2rem", md: "2.8rem" } }}
                            >
                                Breaking Communication Barriers
                            </Typography>

                            {/* subcopy */}
                            <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
                                Porter Saathi isn&apos;t just about technology—it&apos;s about creating opportunities.
                                By making logistics accessible through voice, we&apos;re empowering users who may face
                                challenges with traditional interfaces.
                            </Typography>

                            {/* bullets */}
                            <List sx={{ mt: 1 }}>
                                {[
                                    {
                                        title: "Inclusive Design",
                                        desc: "Built with accessibility principles from the ground up",
                                    },
                                    {
                                        title: "Cultural Sensitivity",
                                        desc: "Understanding diverse communication styles across India",
                                    },
                                    {
                                        title: "Digital Inclusion",
                                        desc: "Making technology accessible to all skill levels",
                                    },
                                ].map((item) => (
                                    <ListItem key={item.title} disableGutters sx={{ alignItems: "flex-start", mb: 1.25 }}>
                                        <ListItemIcon sx={{ minWidth: 36, mt: 0.25 }}>
                                            {/* ring + dot */}
                                            <Box
                                                sx={{
                                                    width: 20,
                                                    height: 20,
                                                    borderRadius: "50%",
                                                    border: "2px solid",
                                                    borderColor: "text.primary",
                                                    display: "grid",
                                                    placeItems: "center",
                                                }}
                                            >
                                                <Box sx={{ width: 8, height: 8, bgcolor: "text.primary", borderRadius: "50%" }} />
                                            </Box>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={<Typography fontWeight={800}>{item.title}</Typography>}
                                            secondary={<Typography color="text.secondary">{item.desc}</Typography>}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Stack>
                    </Grid>

                    {/* Right: image */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper
                            elevation={8}
                            sx={{
                                overflow: "hidden",
                                borderRadius: 4,
                                boxShadow: "0 24px 80px rgba(3,70,219,0.12), 0 10px 24px rgba(0,0,0,0.08)",
                                ml: { md: "auto" },
                                maxWidth: 840,
                            }}
                        >
                            <Box
                                component="img"
                                src={accessImg}
                                alt="Accessible logistics"
                                sx={{ width: "100%", height: { xs: 280, sm: 360, md: 420 }, objectFit: "cover", display: "block" }}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* COVERAGE */}
            <Box sx={{ bgcolor: "grey.50" }}>
                <Container
                    id="coverage"
                    maxWidth="xl"
                    sx={{ py: { xs: 10, md: 12 }, scrollMarginTop: "96px" }}
                >
                    {/* badge + heading */}
                    <Stack alignItems="center" spacing={2} sx={{ mb: { xs: 4, md: 6 } }}>
                        <Chip
                            icon={<PlaceOutlinedIcon sx={{ fontSize: 18 }} />}
                            label="Coverage"
                            size="small"
                            sx={{
                                fontWeight: 700,
                                bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
                                color: "text.primary",
                                "& .MuiChip-icon": { color: "text.primary" },
                            }}
                        />
                        <Typography
                            variant="h3"
                            align="center"
                            sx={{ fontWeight: 900, letterSpacing: -0.5, lineHeight: 1.15 }}
                        >
                            Serving 22+ Cities Across India
                        </Typography>
                        <Typography align="center" color="text.secondary" sx={{ maxWidth: 960 }}>
                            Porter Saathi is available in major metropolitan cities across India, bringing
                            voice-first logistics to millions of users.
                        </Typography>
                    </Stack>

                    <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
                        {/* Left: cityscape image */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Paper
                                elevation={6}
                                sx={{
                                    overflow: "hidden",
                                    borderRadius: 4,
                                    boxShadow:
                                        "0 24px 80px rgba(3,70,219,0.12), 0 10px 24px rgba(0,0,0,0.08)",
                                }}
                            >
                                <Box
                                    component="img"
                                    src={coverageImg}
                                    alt="Indian city coverage"
                                    sx={{
                                        display: "block",
                                        width: "100%",
                                        height: { xs: 260, sm: 360, md: 420 },
                                        objectFit: "cover",
                                    }}
                                />
                            </Paper>
                        </Grid>

                        {/* Right: region cards */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Stack spacing={3}>
                                {/* North India */}
                                <Paper
                                    variant="outlined"
                                    sx={{ p: { xs: 3, md: 3.5 }, borderRadius: 3 }}
                                >
                                    <Typography variant="h6" fontWeight={900} sx={{ mb: 1.5 }}>
                                        North India
                                    </Typography>
                                    <Grid container spacing={1.5}>
                                        {/* column 1 */}
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            {["Delhi", "Lucknow", "Ghaziabad"].map((city) => (
                                                <Stack key={city} direction="row" spacing={1.25} alignItems="center" sx={{ my: 0.5 }}>
                                                    <CheckCircleRoundedIcon sx={{ fontSize: 18, color: "success.main" }} />
                                                    <Typography>{city}</Typography>
                                                </Stack>
                                            ))}
                                        </Grid>
                                        {/* column 2 */}
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            {["Jaipur", "Kanpur", "Ludhiana"].map((city) => (
                                                <Stack key={city} direction="row" spacing={1.25} alignItems="center" sx={{ my: 0.5 }}>
                                                    <CheckCircleRoundedIcon sx={{ fontSize: 18, color: "success.main" }} />
                                                    <Typography>{city}</Typography>
                                                </Stack>
                                            ))}
                                        </Grid>
                                    </Grid>
                                </Paper>

                                {/* South India */}
                                <Paper
                                    variant="outlined"
                                    sx={{ p: { xs: 3, md: 3.5 }, borderRadius: 3 }}
                                >
                                    <Typography variant="h6" fontWeight={900} sx={{ mb: 1.5 }}>
                                        South India
                                    </Typography>
                                    <Grid container spacing={1.5}>
                                        {/* column 1 */}
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            {["Bangalore", "Chennai"].map((city) => (
                                                <Stack key={city} direction="row" spacing={1.25} alignItems="center" sx={{ my: 0.5 }}>
                                                    <CheckCircleRoundedIcon sx={{ fontSize: 18, color: "success.main" }} />
                                                    <Typography>{city}</Typography>
                                                </Stack>
                                            ))}
                                        </Grid>
                                        {/* column 2 */}
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            {["Hyderabad", "Visakhapatnam"].map((city) => (
                                                <Stack key={city} direction="row" spacing={1.25} alignItems="center" sx={{ my: 0.5 }}>
                                                    <CheckCircleRoundedIcon sx={{ fontSize: 18, color: "success.main" }} />
                                                    <Typography>{city}</Typography>
                                                </Stack>
                                            ))}
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
            </Box>



        </>
    );
}
