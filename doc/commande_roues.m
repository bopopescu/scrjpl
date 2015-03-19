function commande_roues()

    function draw()
       clf(); hold on; axis([-30, 30, -30, 30]); axis square;
       M =2*[ 1 -1  0  0 -1 -1 0 0 -1 1 0 0 3  3  0; 
            -2 -2 -2 -1 -1  1 1 2  2 2 2 1 0.5 -0.5 -1];
       M=[M;ones(1,length(M))]; 
       R=[cos(x(3)),-sin(x(3)),x(1);sin(x(3)),cos(x(3)),x(2);0 0 1];    
       M =R*M;
       plot(M(1,:),M(2,:),'blue','LineWidth',2);    
       drawnow();
    end

    function x=f(x,u)
       x=[((x(4)+x(5))/l)*cos(x(3));
          ((x(4)+x(5))/l)*sin(x(3));
          ((x(5)-x(4))/l); 
          r*u(1);
          r*u(2)];
    end
    
    l = 1;
    r = 0.3;
    x = [0; 0; 0; 4; 3];
    u = [0; 0];
    dt = 0.01;
    
    for t=0:dt:10
       x = x + f(x,u)*dt;
       x(3)*180/3.14
       draw(); 
    end

end