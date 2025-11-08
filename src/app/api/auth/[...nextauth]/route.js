import NextAuth from 'next-auth';
import axios from 'axios';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'text' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				try {
					const body = {
						email: credentials.email,
						password: credentials.password,
					};

					console.log('Authorize with credentials:', body);

					const res = await axios.post(
						`${process.env.LENS_API_URL}/auth/login`,
						body,
						{
							headers: {
								'Content-Type': 'application/json',
							},
						}
					);

					if (!res || res.status !== 200) {
						console.log('Authorization failed with response:', res);
						return null;
					}

					const data = res.data;

					if (data.success) {
						return {
							id: data.user.id,
							name: data.user.username,
							email: data.user.email,
							token: data.token,
                            roles: data.user.role,
						};
					} else {
						return null;
					}
				} catch (error) {
					console.error(
						'Error during credentials authorization:',
						error
					);
					console.log(
						'Error details:',
						error.response ? error.response.data : error.message
					);
					return null;
				}
			},
		}),
	],
	session: {
		strategy: 'jwt',
		maxAge: 60 * 60 * 24, // 24 hours
	},
	jwt: {
		secret: process.env.NEXTAUTH_SECRET,
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.accessToken = user.token;
				token.user = user;
			}
			return token;
		},
		async session({ session, token }) {
			session.user = token.user;
			session.accessToken = token.accessToken;
			return session;
		},
	},
	pages: {
		signIn: '/auth/login',
		error: '/auth/error',
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
