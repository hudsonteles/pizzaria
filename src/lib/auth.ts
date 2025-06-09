import axios from "axios";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const urls = {
    test: '',
    development: `${process.env.BASE_URL_LOCAL}`,
    production: `${process.env.BASE_URL}`
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',

            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Senha", type: "password" }
            },

            async authorize(credentials, req) {
                await axios.get(`${urls[process.env.NODE_ENV]}/sanctum/csrf-cookie`, {
                    withCredentials: true,
                });
                const login = await axios.post(
                    `${urls[process.env.NODE_ENV]}/api/v1/auth/login`,
                    {
                        email: credentials.email,
                        password: credentials.password,
                    },
                    {
                        withCredentials: true,
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            "X-Requested-With": "XMLHttpRequest",
                        }
                    }
                );
                if (login.status === 200) {
                    return login.data;
                } else {
                    return null;
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 1 day
    },
    callbacks: {
        async jwt({ token, user, trigger }) {
            // No login, já preenche normalmente
            if (user) {
                token.name = user.info.name;
                token.lastname = user.info.lastname;
                token.email = user.info.email;
                token.group = user.info.group;
                token.accessToken = user.accessToken;
            }

            // Se o trigger for 'update', buscar dados atualizados do backend
            if (trigger === "update" && Boolean(token.accessToken)) {
                try {
                    const response = await axios.get(
                        `${urls[process.env.NODE_ENV]}/api/v1/auth`, // endpoint que retorna os dados atualizados do usuário
                        {
                            headers: {
                                Authorization: `Bearer ${token.accessToken}`,
                                Accept: "application/json",
                            }
                        }
                    );
                    const info = response.data.info
                    token.name = info.name;
                    token.lastname = info.lastname;
                    token.email = info.email;
                    token.group = info.group;

                    return token
                } catch (e) {
                    console.error("AUTH: Erro ao atualizar token:", e);
                    // Se der erro, não atualiza o token
                    return token;
                }
            }

            return token;
        },
        async session({ session, token }) {
            session.user = {
                name: token.name,
                lastname: token.lastname,
                email: token.email,
                accessToken: token.accessToken,
                group: token.group,
            };
            return session;
        },
    },
    pages: {
        signIn: "/auth/login"
    },
};
