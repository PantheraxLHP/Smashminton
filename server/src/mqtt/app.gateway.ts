import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
    namespace: '/app',
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(AppGateway.name);

    handleConnection(client: Socket) {
        this.logger.log(`🔌 Client connected: ${client.id} from ${client.handshake.address}`);

        // Send welcome message to newly connected client
        client.emit('connected', {
            message: 'Connected to app websocket server',
            clientId: client.id,
            timestamp: Date.now()
        });
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`🔌 Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('subscribe_employee')
    handleSubscribeToEmployee(
        @MessageBody() data: { roomID: number },
        @ConnectedSocket() client: Socket
    ) {
        const roomName = `employee_${data.roomID}`;
        client.join(roomName);
        this.logger.log(`👤 Client ${client.id} subscribed to room ${roomName} with roomID = ${data.roomID}`);

        client.emit('subscribed', { roomID: data.roomID, roomName });
    }

    @SubscribeMessage('subscribe_global')
    handleSubscribeToGlobal(
        @MessageBody() data: { userRole?: string },
        @ConnectedSocket() client: Socket
    ) {
        const room = 'global_notifications';

        // Role-based access control
        const allowedRoles = ['employee', 'wh_manager', 'hr_manager', 'admin'];

        if (data.userRole && allowedRoles.includes(data.userRole)) {
            client.join(room);
            this.logger.log(`🌐 Client ${client.id} (${data.userRole}) subscribed to global notifications`);

            client.emit('subscribed_global', {
                room,
                userRole: data.userRole,
                success: true
            });
        } else {
            this.logger.log(`🚫 Client ${client.id} (${data.userRole || 'unknown'}) denied access to global notifications`);

            client.emit('subscribed_global', {
                room,
                userRole: data.userRole,
                success: false,
                error: 'Access denied - employees only'
            });
        }
    }

    @SubscribeMessage('unsubscribe_global')
    handleUnsubscribeFromGlobal(
        @ConnectedSocket() client: Socket
    ) {
        const room = 'global_notifications';
        client.leave(room);
        this.logger.log(`🌐 Client ${client.id} unsubscribed from global notifications`);

        client.emit('unsubscribed_global', { room });
    }

    @SubscribeMessage('subscribe_all_employee')
    handleSubscribeToAllEmployee(
        @MessageBody() data: { userRole?: string },
        @ConnectedSocket() client: Socket
    ) {
        const room = 'employee_notifications';

        const allowedRoles = ['employee'];

        if (data.userRole && allowedRoles.includes(data.userRole)) {
            client.join(room);
            this.logger.log(`🌐 Client ${client.id} (${data.userRole}) subscribed to all employee notifications`);

            client.emit('subscribed_all_employee', {
                room,
                userRole: data.userRole,
                success: true
            });
        } else {
            this.logger.log(`🚫 Client ${client.id} (${data.userRole || 'unknown'}) denied access to all employee notifications`);

            client.emit('subscribed_all_employee', {
                room,
                userRole: data.userRole,
                success: false,
                error: 'Access denied - employees with role employee only'
            });
        }
    }

    // Methods to emit events to specific employees
    emitToEmployee(roomID: number, event: string, data: any) {
        const room = `employee_${roomID}`;
        this.server.to(room).emit(event, {
            type: event,
            ...data,
            timestamp: Date.now()
        });
        this.logger.log(`📤 Emitted ${event} to room ${roomID} websocket client:`, data);
    }

    // Specific methods for fingerprint events
    enrollmentStarted(roomID: number, employeeID: number, fingerID: number) {
        this.emitToEmployee(roomID, 'enroll_started', { employeeID, fingerID });
    }

    enrollmentStep(roomID: number, employeeID: number, step: 'remove_finger' | 'place_again') {
        this.emitToEmployee(roomID, 'enroll_step', { employeeID, step });
    }

    enrollmentSuccess(roomID: number, employeeID: number, fingerID: number) {
        this.emitToEmployee(roomID, 'enroll_success', { employeeID, fingerID });
    }

    enrollmentFailure(roomID: number, employeeID: number, error: string) {
        this.emitToEmployee(roomID, 'enroll_failure', { employeeID, error });
    }

    // Method to emit events to all global subscribers
    emitToGlobal(event: string, data: any) {
        const room = `global_notifications`;
        this.server.to(room).emit(event, {
            type: event,
            ...data,
            timestamp: Date.now()
        });
        this.logger.log(`📤 Emitted ${event} global notification:`, data);
    }

    emitToAllEmployee(event: string, data: any) {
        const room = `employee_notifications`;
        this.server.to(room).emit(event, {
            type: event,
            ...data,
            timestamp: Date.now()
        });
        this.logger.log(`📤 Emitted ${event} to all employee websocket clients:`, data);
    }

    regularCourtBookingCheck(zoneCourt: Map<string, string[]>) {
        const zoneCourtObj = Object.fromEntries(zoneCourt);
        this.emitToAllEmployee('regular_court_booking_check', { zoneCourtObj });
    }
}
