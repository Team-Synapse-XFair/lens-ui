'use client';

import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import LocationPickerDialogue from '../locationPickerDialogue';
import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
    CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const builderSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters long').max(100, 'Name must be at most 100 characters long'),
    estd: z.number().min(1800, 'Established year must be after 1800').max(new Date().getFullYear(), `Established year cannot be in the future`).optional(),
    email: z.email('Invalid email address'),
    phone: z.string().min(7, 'Phone number must be at least 7 digits long').max(15, 'Phone number must be at most 15 digits long').regex(/^(?:\+91|91)?[6-9]\d{9}$/, 'Enter a valid Indian phone number'),
    website: z.url('Invalid website URL').optional(),
    projects: z.array(z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid project ID')).optional(),
});

const nullData = {
    name: '',
    estd: '',
    location: {},
    email: '',
    phone: '',
    website: '',
    projects: [],
};

export default function BuilderForm({ initialData = null }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState(null);
    const [location, setLocation] = useState(null);
    const [editLocationOpen, setEditLocationOpen] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(builderSchema),
        defaultValues: initialData || nullData,
    });

    const onSubmit = async (data) => {
        setLoading(true);
        setServerError(null);

        const builderData = {...data, location: location || {}};

        try {
            const response = await axios.post('/api/builder/create', builderData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

    const respData = response.data;
    console.log('Builder form submission response:', respData);

    if (respData.success) {
        router.push('/builder/' + respData.builderId);
    } else {
        setServerError(respData.message || 'An error occurred. Please try again.');
    }
} catch (error) {
    console.error('Error submitting builder form:', error);
    setServerError('An unexpected error occurred. Please try again later.');
}

        setLoading(false);
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardDescription className="text-center mb-4">
                    {initialData ? 'Update your Builder Profile' : 'Create your Builder Profile'}
                </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="grid gap-4">
                        {serverError && (
                            <div className="text-red-600 text-center mb-4">
                                {serverError}
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" {...register('name')} disabled={loading} />
                            {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="estd">Established Year</Label>
                            <Input id="estd" type="number" {...register('estd', { valueAsNumber: true })} disabled={loading} />
                            {errors.estd && <p className="text-red-600 text-sm">{errors.estd.message}</p>}
                        </div>
                        <div className="grid gap-2 w-full">
                            <Label htmlFor="location">Location</Label>
                            {!location && <LocationPickerDialogue
                                onSelect={(location) =>
                                    setLocation(location)
                                }
                                openState={editLocationOpen}
                            />}
                            {location && <Button
                                variant="outline"
                                type="button"
                                onClick={() => {setEditLocationOpen(true); setLocation(null);}}
                            >
                                {location ? 'Edit Location' : 'Set Location'}
                            </Button>}
                            {location && (
                                <div className="mt-2 p-2 border rounded bg-background/50">
                                    <p><strong>Selected Location:</strong></p>
                                    <p>Address: {location.display_name || 'N/A'}</p>
                                    <p>Latitude: {location.lat}</p>
                                    <p>Longitude: {location.lon}</p>
                                </div>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" {...register('email')} disabled={loading} />
                            {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" {...register('phone')} disabled={loading} />
                            {errors.phone && <p className="text-red-600 text-sm">{errors.phone.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="website">Website</Label>
                            <Input id="website" {...register('website')} disabled={loading} />
                            {errors.website && <p className="text-red-600 text-sm">{errors.website.message}</p>}
                        </div>
                    </CardContent>
                    <CardFooter className="pt-8">
                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? 'Submitting...' : initialData ? 'Update Builder' : 'Create Builder'}
                        </Button>
                    </CardFooter>
                </form>
        </Card>
    );
}