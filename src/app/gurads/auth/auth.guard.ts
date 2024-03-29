import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "src/app/services/auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.cheakAuth().then(user => {
      if (user) {
        return true;
      } else {
        this.router.navigateByUrl('/login');
        return false;
      }
    }).catch(error => {
      console.error('Error checking Authentication :', error);
      this.router.navigateByUrl('/login');
      return false;
    });
  }
}
