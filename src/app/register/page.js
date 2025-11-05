import RegisterForm from '@/components/registerForm';

export default function RegisterPage() {
    return (
        <div className="flex items-center justify-center bg-background px-4" style={{ height: "calc(100vh - var(--header-height))" }}>
            <div className="max-w-md sm:max-w-md lg:max-w-lg w-full bg-background p-2 py-8 pt-12 rounded-lg border">
                <h2 className="text-2xl font-bold text-center">Create an Account</h2>
                <RegisterForm />
            </div>
        </div>
    );
}